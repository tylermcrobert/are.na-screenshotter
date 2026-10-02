export const MESSAGE = {
  SCREENSHOT: "screenshot",
  CLOSE_PANEL: "closePanel",
  START_RECORDING: "startRecording",
  STOP_RECORDING: "stopRecording"
} as const

export type RecordingMessage =
  | { type: typeof MESSAGE.START_RECORDING; streamId: string }
  | { type: typeof MESSAGE.STOP_RECORDING }

export type RecordingResult = { gif: string } | { error: string }
