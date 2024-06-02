import { createContext, useContext, useState } from "react"

import { ApiReq } from "~lib/request"

import type { APIChannel } from "../../web/src/types"

type CaptureContextValue = {
  api: ApiReq
  accessToken: string
  userSlug: string
  screenshot: string | null
  originTitle: string | null
  originUrl: string | null
  postedTo: APIChannel | null
  currentChannel: APIChannel | null
  hostName: string | null
  error: string | null
  setError: (error: string | null) => void
  setScreenshot: (screenshot: string | null) => void
  setOriginTitle: (originTitle: string | null) => void
  setOriginUrl: (originUrl: string | null) => void
  setPostedTo: (postedTo: APIChannel | null) => void
  setCurrentChannel: (currentChannel: APIChannel | null) => void
}

const CaptureContext = createContext<CaptureContextValue>({
  api: {} as unknown as ApiReq,
  accessToken: "",
  userSlug: "",
  screenshot: null,
  originTitle: null,
  originUrl: null,
  postedTo: null,
  currentChannel: null,
  hostName: null,
  error: null,
  setError: () => {},
  setScreenshot: () => {},
  setOriginTitle: () => {},
  setOriginUrl: () => {},
  setPostedTo: () => {},
  setCurrentChannel: () => {}
})

interface CaptureProviderProps {
  children: React.ReactNode
  accessToken: string
  error: string | null
  userSlug: string
  setError: (error: string | null) => void
}

export const CaptureProvider = ({
  children,
  error,
  accessToken,
  userSlug,
  setError
}: CaptureProviderProps) => {
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [originTitle, setOriginTitle] = useState<string | null>(null)
  const [originUrl, setOriginUrl] = useState<string | null>(null)
  const [postedTo, setPostedTo] = useState<APIChannel | null>(null)
  const [currentChannel, setCurrentChannel] = useState<APIChannel | null>(null)

  const api = new ApiReq(accessToken, userSlug)

  const hostName = originUrl ? new URL(originUrl).hostname.toString() : null

  const value: CaptureContextValue = {
    userSlug,
    api,
    accessToken,
    hostName,
    screenshot,
    originTitle,
    originUrl,
    postedTo,
    currentChannel,
    error,
    setError,
    setScreenshot,
    setOriginTitle,
    setOriginUrl,
    setPostedTo,
    setCurrentChannel
  }

  return (
    <CaptureContext.Provider value={value}>{children}</CaptureContext.Provider>
  )
}

export const useCaptureCtx = () => {
  return useContext(CaptureContext)
}

export default CaptureContext
