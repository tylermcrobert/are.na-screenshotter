import { useEffect, useState } from "react"

import Auth from "~components/Auth"
import Capture from "~components/Capture"
import { CaptureProvider } from "~components/CaptureCtx"

export default function IndexPopup() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userSlug, setUserSlug] = useState<string | null>(null)

  useEffect(() => {
    chrome.storage.local.get("accessToken").then((res) => {
      setAccessToken(res.accessToken)
    })

    chrome.storage.local.get("userSlug").then((res) => {
      setUserSlug(res.userSlug)
    })
  }, [])

  return (
    <div className="px-2 w-[270px]">
      {accessToken && userSlug ? (
        <CaptureProvider
          userSlug={userSlug}
          accessToken={accessToken}
          setError={setError}
          error={error}>
          <Capture />
        </CaptureProvider>
      ) : (
        <Auth
          setAccessToken={setAccessToken}
          setError={setError}
          setUserSlug={setUserSlug}
        />
      )}

      {error && (
        <div className="bg-red-100 my-2 p-1 rounded text-center text-red-500">
          {error}
        </div>
      )}
    </div>
  )
}
