import Auth from "~components/Auth"
import Capture from "~components/Capture"

import "./style.css"

import { useEffect, useState } from "react"

import { CaptureProvider } from "~components/CaptureCtx"

function IndexPopup() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    chrome.storage.local.get("accessToken").then((res) => {
      setAccessToken(res.accessToken)
    })
  }, [])

  return (
    <div className="px-2 w-[270px]">
      {accessToken ? (
        <CaptureProvider
          accessToken={accessToken}
          setError={setError}
          error={error}>
          <Capture />
        </CaptureProvider>
      ) : (
        <Auth setAccessToken={setAccessToken} setError={setError} />
      )}

      {error && (
        <div className="bg-red-100 my-2 p-1 rounded text-center text-red-500">
          {error}
        </div>
      )}
    </div>
  )
}

export default IndexPopup
