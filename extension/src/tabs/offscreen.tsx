import { startGifRecording, type GifRecorder } from "~lib/gif-recorder"
import {
  MESSAGE,
  type RecordingMessage,
  type RecordingResult
} from "~lib/messages"

let recorder: Promise<GifRecorder> | null = null

chrome.runtime.onMessage.addListener(
  (
    message: RecordingMessage,
    _sender,
    sendResponse: (result: RecordingResult) => void
  ) => {
    if (message.type === MESSAGE.START_RECORDING) {
      recorder = startGifRecording(message.streamId)
      /** Start failures are reported when recording stops */
      recorder.catch(() => {})
    } else if (message.type === MESSAGE.STOP_RECORDING) {
      stopRecording().then(sendResponse)
      /** Keeps the message channel open for the async response */
      return true
    }
  }
)

async function stopRecording(): Promise<RecordingResult> {
  try {
    if (!recorder) throw new Error("Recording never started")
    const blob = await (await recorder).stop()
    return { gif: await toDataUrl(blob) }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  } finally {
    recorder = null
  }
}

function toDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

export default function Offscreen() {
  return null
}
