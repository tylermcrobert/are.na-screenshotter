import { useEffect, useState } from "react"

import { ArenaScreenshotterClient } from "~lib/Arena"

import Auth from "./Auth"
import Capture from "./Capture"
import { CaptureProvider } from "./CaptureCtx"
import Toast from "./Toast"

type StoredCapture = {
  screenshot: string | null
  originUrl: string
  originTitle: string
}

const PlasmoOverlay = () => {
  const [stored, setStored] = useState<StoredCapture | null>(null)
  const [arena, setArena] = useState<ArenaScreenshotterClient | null>(null)
  const [error, setError] = useState<string | null>(null)

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
        setStored({
          screenshot: res.screenshot ?? null,
          originUrl: res.tabUrl ?? "",
          originTitle: res.tabTitle ?? ""
        })
      })
  }, [])

  if (!stored) return null

  return (
    <>
      {error ? <Toast error={error} onClose={() => setError(null)} /> : null}
      {!arena ? (
        <Auth onSuccess={signIn} onError={setError} />
      ) : !stored.screenshot ? (
        <MissingScreenshot />
      ) : (
        <CaptureProvider
          arena={arena}
          screenshot={stored.screenshot}
          originUrl={stored.originUrl}
          originTitle={stored.originTitle}
          setError={setError}>
          <Capture />
        </CaptureProvider>
      )}
    </>
  )
}

function MissingScreenshot() {
  return (
    <div className="flex h-dvh items-center justify-center px-6 text-center text-gray-4">
      Couldn&apos;t capture this page. Close the panel and try again.
    </div>
  )
}

export default PlasmoOverlay
