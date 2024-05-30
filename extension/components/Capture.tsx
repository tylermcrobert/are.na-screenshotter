import { useEffect, useState } from "react"

const FPO_CHANNEL_ID = "screenshotter-test"
const ARENA_API_URL = "http://localhost:5173/api/are.na"

export default function Capture() {
  const [loading, setLoading] = useState(true)
  const [base64Image, setBase64Image] = useState<string | null>(null)
  const [originTitle, setOriginTitle] = useState<string | null>(null)
  const [originUrl, setOriginUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [blockId, setBlockId] = useState<number | null>(null)

  /**
   * Captures a screenshot
   */
  async function captureScreenshot() {
    setLoading(true)

    const screenshot = await chrome.tabs.captureVisibleTab()

    if (!screenshot) {
      setLoading(false)
      setError("Failed to capture screenshot.")
      return
    }

    setBase64Image(screenshot)
    setLoading(false)
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
   * Posts the screenshot to Are.na
   */
  async function postToArena() {
    setLoading(true)
    try {
      /**
       * Post to arena
       */

      const arenaResponse = await fetch(
        `${ARENA_API_URL}/channels/${FPO_CHANNEL_ID}`,
        {
          method: "POST",
          body: JSON.stringify({
            screenshot: base64Image,
            title: originTitle,
            description: originUrl
          })
        }
      )

      const arenaJson = await arenaResponse.json()

      if (!arenaResponse.ok) {
        throw new Error(
          arenaJson.error
            ? `API Error: "${arenaJson.error}"`
            : "An unexpected error occurred posting to Are.na."
        )
      }

      /**
       * Handle resulting state
       */

      setBlockId(arenaJson.data.id)
      setLoading(false)
      setError(null)
    } catch (e) {
      console.log(e)
      setLoading(false)
      setError(e.message ? e.message : "An unexpected error occurred.")
    }
  }

  function clear() {
    setBlockId(null)
    setBase64Image(null)
    captureScreenshot()
  }

  if (blockId) {
    return (
      <div className="py-2 min-h-60">
        <div className="flex items-center gap-2">
          <img src={base64Image} className="w-16" />
          <div>
            <div className="font-bold">{originTitle}</div>
            <div className="text-gray-4">
              {" "}
              {originUrl ? new URL(originUrl).hostname.toString() : null}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="w-full btn" onClick={clear}>
            Take another &rarr;
          </button>

          <a
            href={`https://are.na/channel/${FPO_CHANNEL_ID}`}
            className="w-full btn"
            target="_blank">
            View channel
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center h-[300px]">
        {base64Image && <img src={base64Image} className="w-full" />}
      </div>

      <div className="border-gray-2 border-y py-3 text-center">
        <div className="font-bold">{originTitle}</div>
        <div className="text-gray-4">
          {originUrl ? new URL(originUrl).hostname.toString() : null}
        </div>
      </div>

      <div className="flex gap-2 py-2">
        <button className="w-full btn" onClick={postToArena}>
          {!loading ? <>Connect &rarr;</> : "Loading..."}
        </button>
        <button className="w-full btn" onClick={captureScreenshot}>
          Retake
        </button>
      </div>

      {error && <div className="text-center text-red-500">{error}</div>}
    </div>
  )
}
