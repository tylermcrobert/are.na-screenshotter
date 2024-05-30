import { useEffect, useState } from "react"

import ButtonRow from "./ButtonRow"
import CaptureMeta from "./CaptureMeta"
import Channels from "./Channels"
import ImageDisplay from "./ImageDisplay"

export default function Capture() {
  const [base64Image, setBase64Image] = useState<string | null>(null)
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
    const screenshot = await chrome.tabs.captureVisibleTab()
    setBase64Image(screenshot)
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
    setBase64Image(null)
    captureScreenshot()
  }

  return (
    <div>
      <ImageDisplay image={base64Image} refreshScreenshot={refreshScreenshot} />

      {isSuccess ? (
        <div className="my-10 text-center">
          <div className="mb-2 font-bold text-[15px]">
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

      <ButtonRow
        image={base64Image}
        originUrl={originUrl}
        originTitle={originTitle}
        onError={(err) => setError(err)}
        onSuccess={() => setSuccess(true)}
        captureScreenshot={captureScreenshot}
        channelId={currentChannelId}
      />

      {/* <a
        href={`https://are.na/channel/${currentChannelId}`}
        className="w-full btn"
        target="_blank">
        View channel &rarr;
      </a> */}

      {error && <div className="text-center text-red-500">{error}</div>}
    </div>
  )
}
