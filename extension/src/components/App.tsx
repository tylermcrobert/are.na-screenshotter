import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { CaptureProvider } from "~components/CaptureCtx"

import Auth from "./Auth"
import Capture from "./Capture"

const PlasmoOverlay = () => {
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [userSlug, setUserSlug] = useState<string | null>(null)

  useEffect(() => {
    chrome.storage.local.get("accessToken").then((res) => {
      setAccessToken(res.accessToken)
    })

    chrome.storage.local.get("userSlug").then((res) => {
      setUserSlug(res.userSlug)
    })

    chrome.storage.local.get("screenshot").then((res) => {
      setScreenshot(res.screenshot)
    })
  })

  // function signOut() {
  //   chrome.storage.local.remove("userSlug")
  //   chrome.storage.local.remove("accessToken")

  //   setUserSlug(null)
  //   setAccessToken(null)
  // }

  async function authenticate() {
    try {
      const response = await sendToBackground({ name: "auth" })

      setAccessToken(response.accessToken)
      setUserSlug(response.userSlug)
    } catch (error) {
      console.error(error)
      setError("Error authenticating")
    }
  }

  return (
    <>
      {accessToken && userSlug ? (
        <CaptureProvider
          screenshot={screenshot}
          userSlug={userSlug}
          accessToken={accessToken}
          error={error}
          originTitle={document.title}
          originUrl={window.location.href}
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
