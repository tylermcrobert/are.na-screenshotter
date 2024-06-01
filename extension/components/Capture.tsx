import { useEffect, useState } from "react"

import type { APIChannel } from "../../web/src/types"
import CaptureMeta from "./CaptureMeta"
import Channels from "./Channels"
import ConnectButton from "./ConnectButton"
import ImageDisplay from "./ImageDisplay"

export default function Capture() {
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [originTitle, setOriginTitle] = useState<string | null>(null)
  const [originUrl, setOriginUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [postedTo, setPostedTo] = useState<APIChannel | null>(null)
  const [currentChannel, setCurrentChannel] = useState<APIChannel | null>(null)

  const hostName = originUrl ? new URL(originUrl).hostname.toString() : null

  /**
   * Captures a screenshot
   */
  async function captureScreenshot() {
    const chromeCapture = await chrome.tabs.captureVisibleTab()
    setScreenshot(chromeCapture)
  }

  /**
   * Actions on mount
   */
  useEffect(() => {
    captureScreenshot()

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].title && tabs[0].url) {
        setOriginTitle(tabs[0].title)
        setOriginUrl(tabs[0].url)
      } else {
        setError("Unable to capture the current tab.")
      }
    })
  }, [])

  /**
   * Clears the current state
   */
  function refreshScreenshot() {
    setPostedTo(null)
    setScreenshot(null)
    captureScreenshot()
  }

  function closeWindow() {
    window.close()
  }

  return (
    <div>
      <ImageDisplay
        screenshot={screenshot}
        refreshScreenshot={refreshScreenshot}
      />

      {!!postedTo ? (
        <div className="my-10 text-center">
          <div className="mb-1 font-bold text-[15px]">
            Posted to {postedTo.title}.
          </div>
          <div className="text-gray-4">
            <div>{originTitle}</div>
            <div>{hostName}</div>
          </div>
        </div>
      ) : (
        <>
          <CaptureMeta hostName={hostName} title={originTitle} />
          <Channels
            onError={(err) => setError(err)}
            currentChannel={currentChannel}
            setCurrentChannel={setCurrentChannel}
          />
        </>
      )}

      <div className="flex gap-2 my-3">
        <button className="btn" onClick={closeWindow}>
          Close
        </button>

        {!postedTo ? (
          <ConnectButton
            screenshot={screenshot}
            originUrl={originUrl}
            originTitle={originTitle}
            onError={(err) => setError(err)}
            onSuccess={() => setPostedTo(currentChannel)}
            currentChannel={currentChannel}
          />
        ) : (
          <a
            href={`https://are.na/channel/${postedTo.id}`}
            className="w-full btn"
            target="_blank">
            View channel &rarr;
          </a>
        )}
      </div>

      {error && <div className="text-center text-red-500">{error}</div>}
    </div>
  )
}
