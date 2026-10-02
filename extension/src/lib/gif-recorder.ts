import { applyPalette, GIFEncoder, quantize, type Palette } from "gifenc"

const FPS = 10
const MAX_WIDTH = 800
const FRAME_INTERVAL_MS = 1000 / FPS

declare class MediaStreamTrackProcessor<T> {
  constructor(init: { track: MediaStreamTrack })
  readable: ReadableStream<T>
}

export type GifRecorder = {
  stop(): Promise<Blob>
}

type PendingFrame = {
  index: Uint8Array
  palette: Palette
  /** Frame timestamp in microseconds, used for gaps between frames */
  timestamp: number
  /** Wall-clock time, used for the delay of the final frame */
  sampledAt: number
}

export async function startGifRecording(streamId: string): Promise<GifRecorder> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      /** `mandatory` is Chrome-specific and not part of the standard constraints type */
      mandatory: {
        chromeMediaSource: "tab",
        chromeMediaSourceId: streamId,
        /** Min and max with different aspect ratios make Chrome follow the tab's own size instead of letterboxing */
        minWidth: 2,
        minHeight: 2,
        maxWidth: MAX_WIDTH,
        maxHeight: 4096,
        maxFrameRate: 30
      }
    } as MediaTrackConstraints
  })

  const [track] = stream.getVideoTracks()
  const reader = new MediaStreamTrackProcessor<VideoFrame>({
    track
  }).readable.getReader()

  const encoder = GIFEncoder()
  let canvas: OffscreenCanvas | null = null
  let ctx: OffscreenCanvasRenderingContext2D | null = null
  /** Asserted so TS doesn't narrow it to `null`, since it's only assigned inside callbacks */
  let pending = null as PendingFrame | null

  const writePending = (delayMs: number) => {
    if (!pending || !canvas) return
    encoder.writeFrame(pending.index, canvas.width, canvas.height, {
      palette: pending.palette,
      delay: Math.max(delayMs, 20)
    })
  }

  const sample = (frame: VideoFrame) => {
    const sourceWidth = frame.displayWidth
    const sourceHeight = frame.displayHeight

    /** GIF dimensions are fixed by the first frame, so later frames (e.g. after a resize) are letterboxed */
    if (!canvas || !ctx) {
      const scale = Math.min(1, MAX_WIDTH / sourceWidth)
      canvas = new OffscreenCanvas(
        Math.round(sourceWidth * scale),
        Math.round(sourceHeight * scale)
      )
      ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) throw new Error("Couldn't create a canvas to record into")
    }

    const fit = Math.min(canvas.width / sourceWidth, canvas.height / sourceHeight)
    const drawWidth = sourceWidth * fit
    const drawHeight = sourceHeight * fit
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(
      frame,
      (canvas.width - drawWidth) / 2,
      (canvas.height - drawHeight) / 2,
      drawWidth,
      drawHeight
    )

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const palette = quantize(data, 256)
    const index = applyPalette(data, palette)

    if (pending) writePending((frame.timestamp - pending.timestamp) / 1000)
    pending = {
      index,
      palette,
      timestamp: frame.timestamp,
      sampledAt: performance.now()
    }
  }

  const loop = (async () => {
    while (true) {
      const { value: frame, done } = await reader.read()
      if (done) break
      try {
        const elapsedMs = pending
          ? (frame.timestamp - pending.timestamp) / 1000
          : Infinity
        /** Tolerance so a 30fps source doesn't drift past every third frame */
        if (elapsedMs >= FRAME_INTERVAL_MS * 0.9) sample(frame)
      } finally {
        frame.close()
      }
    }
    track.stop()
  })()

  return {
    async stop() {
      await reader.cancel().catch(() => {})
      await loop
      track.stop()

      if (!pending) throw new Error("No frames were captured")
      writePending(performance.now() - pending.sampledAt)
      encoder.finish()

      return new Blob([encoder.bytes()], { type: "image/gif" })
    }
  }
}
