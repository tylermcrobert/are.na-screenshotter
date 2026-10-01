export const MESSAGE = {
  SCREENSHOT: "screenshot",
  CLOSE_PANEL: "closePanel"
} as const

export type MessageType = (typeof MESSAGE)[keyof typeof MESSAGE]

export type Message = { type: MessageType }
