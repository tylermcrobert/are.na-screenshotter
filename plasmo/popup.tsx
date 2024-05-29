import { useEffect, useState } from "react"

import "./style.css"

function IndexPopup() {
  const [loading, setLoading] = useState(true)
  const [base64Image, setBase64Image] = useState<string | null>(null)
  const [originTitle, setOriginTitle] = useState<string | null>(null)
  const [originUrl, setOriginUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function screenshot() {
    setLoading(true)

    const screenshot = await chrome.tabs.captureVisibleTab()
    setBase64Image(screenshot)

    setLoading(false)
  }

  useEffect(() => {
    screenshot()
  }, [])

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setOriginTitle(tabs[0].title)
        setOriginUrl(tabs[0].url)
      }
    })
  }, [])

  useEffect(() => {
    screenshot()
  }, [])

  async function postToArena() {
    setLoading(true)
    const publicUrl = await fetch(
      "https://are-na-screenshotter.vercel.app/api/upload",
      {
        method: "POST",
        body: JSON.stringify({ image: base64Image })
      }
    )
      .then((res) => res.json())
      .then((json) => json.data.publicUrl)
      .catch(() => {
        setLoading(false)
        setError("There was an error uploading your asset.")
      })

    await fetch("http://localhost:5173/api/arena", {
      method: "POST",
      body: JSON.stringify({
        channelId: "tests-twjgqznfouc",
        source:
          "https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIyODM0MTIyMy9vcmlnaW5hbF84MTI0Y2Q1OGQxYTZmMjgzN2U2MTQ1ZTE4YmQ4MzU1Yy5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjI0MDAsImhlaWdodCI6MjQwMCwiZml0IjoiaW5zaWRlIiwid2l0aG91dEVubGFyZ2VtZW50Ijp0cnVlfSwid2VicCI6eyJxdWFsaXR5Ijo2NX0sImpwZWciOnsicXVhbGl0eSI6NjV9LCJyb3RhdGUiOm51bGx9fQ==",
        title: originTitle,
        description: originUrl
      })
    })
      .then(async (res) => {
        setLoading(false)

        if (!res.ok) {
          setError("There was an error posting to arena")
        } else {
          setError(null)
        }
      })
      .catch((e) => {
        console.log(e)
        setLoading(false)
        setError("There was an error posting to arena")
      })
  }
  return (
    <div className="flex flex-col gap-2 p-2 w-60">
      {base64Image && (
        <div className="flex justify-center items-center border-gray-300 bg-gray-200 border aspect-square">
          <img src={base64Image} className="w-full" />
        </div>
      )}

      <button
        onClick={postToArena}
        disabled={loading}
        className="border-gray-200 p-2 border w-full font-bold text-center">
        {!loading ? "Take screenshot" : "Loading..."}
      </button>

      {error && <div className="text-center text-red-500">{error}</div>}
    </div>
  )
}

export default IndexPopup
