import { useEffect, useState } from "react"

import CaptureMeta from "./CaptureMeta"
import Channels from "./Channels"
import ConnectButton from "./ConnectButton"
import ImageDisplay from "./ImageDisplay"

export default function Capture() {
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [originTitle, setOriginTitle] = useState<string | null>(null)
  const [originUrl, setOriginUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setSuccess] = useState(false)
  const [currentChannelId, setCurrentChannelId] = useState<string | null>(null)

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
      if (tabs[0]) {
        setOriginTitle(tabs[0].title)
        setOriginUrl(tabs[0].url)
      }
    })
  }, [])

  /**
   * Clears the current state
   */
  function refreshScreenshot() {
    setSuccess(null)
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

      {isSuccess ? (
        <div className="my-10 text-center">
          <div className="mb-1 font-bold text-[15px]">
            Posted to Lorem Ipsum.
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
            currentChannelId={currentChannelId}
            setCurrentChannel={setCurrentChannelId}
          />
        </>
      )}

      <div className="flex gap-2 my-3">
        <button className="btn" onClick={closeWindow}>
          Close
        </button>

        {!isSuccess ? (
          <ConnectButton
            screenshot={screenshot}
            originUrl={originUrl}
            originTitle={originTitle}
            onError={(err) => setError(err)}
            onSuccess={() => setSuccess(true)}
            channelId={currentChannelId}
          />
        ) : (
          <a
            href={`https://are.na/channel/${currentChannelId}`}
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
