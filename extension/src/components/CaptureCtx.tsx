import type { Channel } from "@aredotna/sdk"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction
} from "react"

import { ArenaScreenshotterClient } from "~lib/Arena"

import Auth from "./Auth"
import Capture from "./Capture"
import Toast from "./Toast"

type CaptureContextValue = {
  arena: ArenaScreenshotterClient
  screenshot: string
  originTitle: string
  originUrl: string
  hostName: string | null
  error: string | null
  setError: (error: string | null) => void
  postedTo: Channel | null
  currentChannel: Channel | null
  setCurrentChannel: Dispatch<SetStateAction<Channel | null>>
  postToArena: () => Promise<void>
}

const CaptureContext = createContext<CaptureContextValue | null>(null)

export function CaptureProvider() {
  const [ready, setReady] = useState(false)
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [arena, setArena] = useState<ArenaScreenshotterClient | null>(null)
  const [originUrl, setOriginUrl] = useState("")
  const [originTitle, setOriginTitle] = useState("")
  const [postedTo, setPostedTo] = useState<Channel | null>(null)
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)
  const hostName = originUrl ? new URL(originUrl).hostname : null

  function signIn(accessToken: string, userSlug: string) {
    setArena(new ArenaScreenshotterClient(accessToken, userSlug))
  }

  useEffect(() => {
    chrome.storage.local
      .get(["accessToken", "userSlug", "screenshot", "tabUrl", "tabTitle"])
      .then((res) => {
        if (res.accessToken && res.userSlug) {
          signIn(res.accessToken, res.userSlug)
        }
        setScreenshot(res.screenshot ?? null)
        setOriginUrl(res.tabUrl ?? "")
        setOriginTitle(res.tabTitle ?? "")
        setReady(true)
      })
  }, [])

  if (!ready) return null

  if (!arena) {
    return (
      <>
        {error ? <Toast error={error} onClose={() => setError(null)} /> : null}
        <Auth onSuccess={signIn} onError={setError} />
      </>
    )
  }

  if (!screenshot) {
    return null
  }

  async function postToArena() {
    if (!currentChannel?.id) {
      setError("Please select a channel.")
      return
    }

    if (!originUrl || !originTitle) {
      setError("Missing screenshot, originUrl, or originTitle.")
      return
    }

    setError(null)

    try {
      await arena.postScreenshot(currentChannel.id, {
        screenshot,
        originUrl,
        originTitle
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
        originUrl,
        originTitle,
        hostName,
        error,
        setError,
        postedTo,
        currentChannel,
        setCurrentChannel,
        postToArena
      }}>
      {error ? <Toast error={error} onClose={() => setError(null)} /> : null}
      <Capture />
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
