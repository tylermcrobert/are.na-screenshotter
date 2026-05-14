import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type { AuthResponse } from "~background/messages/auth"
import { CaptureProvider } from "~components/CaptureCtx"

import Auth from "./Auth"
import Capture from "./Capture"
import Toast from "./Toast"

const PlasmoOverlay = () => {
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [userSlug, setUserSlug] = useState<string | null>(null)
  const [tabUrl, setTabUrl] = useState<string | null>(null)
  const [tabTitle, setTabTitle] = useState<string | null>(null)

  useEffect(() => {
    chrome.storage.local
      .get(["accessToken", "userSlug", "screenshot", "tabUrl", "tabTitle"])
      .then((res) => {
        setAccessToken(res.accessToken ?? null)
        setUserSlug(res.userSlug ?? null)
        setScreenshot(res.screenshot ?? null)
        setTabUrl(res.tabUrl ?? null)
        setTabTitle(res.tabTitle ?? null)
      })
  }, [])

  async function authenticate() {
    try {
      const response = await sendToBackground<AuthResponse>({ name: "auth" })

      if (!response.ok) {
        setError(response.message)
        return
      }

      setAccessToken(response.accessToken)
      setUserSlug(response.userSlug)
    } catch (error) {
      console.error(error)
      setError("Error authenticating")
    }
  }

  return (
    <>
      {error ? <Toast error={error} onClose={() => setError(null)} /> : null}
      {accessToken && userSlug ? (
        <CaptureProvider
          screenshot={screenshot}
          userSlug={userSlug}
          accessToken={accessToken}
          error={error}
          originTitle={tabTitle ?? ""}
          originUrl={tabUrl ?? ""}
          setError={setError}>
          <Capture />
        </CaptureProvider>
      ) : (
        <Auth authenticate={authenticate} />
      )}
    </>
  )
}

export default PlasmoOverlay
