import { useEffect, useState } from "react"

const FPO_CHANNEL_ID = "tests-twjgqznfouc"
const UPLOAD_URL = "http://localhost:5173/api/upload"
const ARENA_API_URL = "http://localhost:5173/api/arena"

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
       * Upload image to Google Cloud Storage bucket
       */

      const gcsRes = await fetch(UPLOAD_URL, {
        method: "POST",
        body: JSON.stringify({ image: base64Image })
      })

      const json = await gcsRes.json()

      if (!gcsRes.ok) {
        throw new Error(`API error: "${json.error}"`)
      }

      if (!json.data.publicUrl) {
        throw new Error(`Internal error: No public URL returned.`)
      }

      const publicUrl: string = json.data.publicUrl

      /**
       * Post to arena
       */

      const arenaResponse = await fetch(ARENA_API_URL, {
        method: "POST",
        body: JSON.stringify({
          channelId: FPO_CHANNEL_ID,
          source: publicUrl,
          title: originTitle,
          description: originUrl
        })
      })

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

  return (
    <div className="flex flex-col gap-2">
      {base64Image && (
        <div className="flex justify-center items-center border-gray-300 bg-gray-200 border aspect-square">
          <img src={base64Image} className="w-full" />
        </div>
      )}

      {!blockId ? (
        <button
          onClick={postToArena}
          disabled={loading}
          className="border-gray-200 p-2 border w-full font-bold text-center">
          {!loading ? "Upload to Are.na" : "Loading..."}
        </button>
      ) : (
        <div className="border-green-200 bg-green-100 p-2 border text-center text-green-500">
          <div className="mb-1 font-bold">Uploaded to Are.na!</div>
          <div>
            <a
              href={`https://are.na/channel/${FPO_CHANNEL_ID}`}
              className="underline"
              target="_blank">
              View channel
            </a>{" "}
            or{" "}
            <button className="underline" onClick={clear}>
              take another
            </button>
            .
          </div>
        </div>
      )}

      {error && <div className="text-center text-red-500">{error}</div>}
    </div>
  )
}
