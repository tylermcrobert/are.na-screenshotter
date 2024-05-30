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

  if (isSuccess) {
    return (
      <div className="flex flex-col py-2 h-60">
        <div className="flex flex-col justify-center items-center gap-2 h-full text-center">
          <img src={base64Image} className="w-16" />
          <div>
            <div className="font-bold text-[15px]">Posted to Lorem Ipsum.</div>
            <div className="text-gray-4">{hostName}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="btn" onClick={refreshScreenshot}>
            Close
          </button>
          <a
            href={`https://are.na/channel/${currentChannelId}`}
            className="w-full btn"
            target="_blank">
            View channel &rarr;
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <ImageDisplay image={base64Image} refreshScreenshot={refreshScreenshot} />
      <CaptureMeta hostName={hostName} title={originTitle} />
      <Channels
        onError={(err) => setError(err)}
        currentChannelId={currentChannelId}
        setCurrentChannel={setCurrentChannelId}
      />
      <ButtonRow
        image={base64Image}
        originUrl={originUrl}
        originTitle={originTitle}
        onError={(err) => setError(err)}
        onSuccess={() => setSuccess(true)}
        captureScreenshot={captureScreenshot}
        channelId={currentChannelId}
      />

      {error && <div className="text-center text-red-500">{error}</div>}
    </div>
  )
}
