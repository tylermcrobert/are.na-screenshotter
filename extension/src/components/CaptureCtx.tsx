import type ArenaType from "are.na"
import { createContext, useContext, useState } from "react"

import { Arena } from "~lib/Arena"

type CaptureContextValue = {
  arena: Arena
  screenshot: string
  originTitle: string
  originUrl: string
  postedTo: ArenaType.Channel | null
  currentChannel: ArenaType.Channel | null
  hostName: string | null
  error: string | null
  setError: (error: string | null) => void
  setPostedTo: (postedTo: ArenaType.Channel | null) => void
  setCurrentChannel: (currentChannel: ArenaType.Channel | null) => void
}

const CaptureContext = createContext<CaptureContextValue>({
  arena: {} as unknown as Arena,
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
} & Pick<
  CaptureContextValue,
  "originTitle" | "originUrl" | "error" | "screenshot" | "setError"
>

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
  const [postedTo, setPostedTo] = useState<ArenaType.Channel | null>(null)
  const [currentChannel, setCurrentChannel] =
    useState<ArenaType.Channel | null>(null)

  const arena = new Arena(accessToken, userSlug)

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
