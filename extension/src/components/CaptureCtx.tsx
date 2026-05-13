import type { Channel } from "@aredotna/sdk/dist/index.js"
import { createContext, useContext, useState } from "react"

import { ArenaScreenshotterClient } from "~lib/Arena"

type CaptureContextValue = {
  arena: ArenaScreenshotterClient
  screenshot: string
  originTitle: string
  originUrl: string
  postedTo: Channel | null
  currentChannel: Channel | null
  hostName: string | null
  error: string | null
  setError: (error: string | null) => void
  setPostedTo: (postedTo: Channel | null) => void
  setCurrentChannel: (currentChannel: Channel | null) => void
}

const CaptureContext = createContext<CaptureContextValue>({
  arena: {} as unknown as ArenaScreenshotterClient,
  screenshot: "",
  originTitle: "",
  originUrl: "",
  postedTo: null,
  currentChannel: null,
  hostName: null,
  error: null,
  setError: () => {},
  setPostedTo: () => {},
  setCurrentChannel: () => {}
})

type CaptureProviderProps = {
  children: React.ReactNode
  userSlug: string
  accessToken: string
} & Pick<CaptureContextValue, "originTitle" | "originUrl" | "error" | "screenshot" | "setError">

export const CaptureProvider = ({
  originTitle,
  originUrl,
  children,
  error,
  screenshot,
  accessToken,
  userSlug,
  setError
}: CaptureProviderProps) => {
  const [postedTo, setPostedTo] = useState<Channel | null>(null)
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)

  const arena = new ArenaScreenshotterClient(accessToken, userSlug)

  const hostName = originUrl ? new URL(originUrl).hostname.toString() : null

  return (
    <CaptureContext.Provider
      value={{
        arena,
        screenshot,
        hostName,
        originTitle,
        originUrl,
        postedTo,
        currentChannel,
        error,
        setError,
        setPostedTo,
        setCurrentChannel
      }}>
      {children}
    </CaptureContext.Provider>
  )
}

export const useCaptureCtx = () => {
  return useContext(CaptureContext)
}

export default CaptureContext
