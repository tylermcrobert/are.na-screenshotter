import type { Channel } from "@aredotna/sdk"
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction
} from "react"

import type { ArenaScreenshotterClient } from "~lib/Arena"

type CaptureContextValue = {
  arena: ArenaScreenshotterClient
  screenshot: string
  originTitle: string
  hostName: string | null
  setError: (error: string | null) => void
  postedTo: Channel | null
  currentChannel: Channel | null
  setCurrentChannel: Dispatch<SetStateAction<Channel | null>>
  postToArena: () => Promise<void>
}

const CaptureContext = createContext<CaptureContextValue | null>(null)

type CaptureProviderProps = {
  arena: ArenaScreenshotterClient
  screenshot: string
  originUrl: string
  originTitle: string
  setError: (error: string | null) => void
  children: ReactNode
}

export function CaptureProvider({
  arena,
  screenshot,
  originUrl,
  originTitle,
  setError,
  children
}: CaptureProviderProps) {
  const [postedTo, setPostedTo] = useState<Channel | null>(null)
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)
  const hostName = originUrl ? new URL(originUrl).hostname : null

  async function postToArena() {
    if (!currentChannel) {
      setError("Please select a channel.")
      return
    }

    setError(null)

    try {
      await arena.postScreenshot(currentChannel.id, {
        screenshot,
        originUrl,
        originTitle: originTitle || hostName || originUrl
      })
      setPostedTo(currentChannel)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not post screenshot.")
    }
  }

  return (
    <CaptureContext.Provider
      value={{
        arena,
        screenshot,
        originTitle,
        hostName,
        setError,
        postedTo,
        currentChannel,
        setCurrentChannel,
        postToArena
      }}>
      {children}
    </CaptureContext.Provider>
  )
}

export function useCaptureCtx() {
  const value = useContext(CaptureContext)
  if (!value) {
    throw new Error("useCaptureCtx must be used within CaptureProvider")
  }
  return value
}
