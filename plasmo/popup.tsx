import { useEffect, useState } from "react"

import "./style.css"

import { log } from "console"

function IndexPopup() {
  const [loading, setLoading] = useState(false)
  const [base64Image, setBase64Image] = useState<string | null>(null)
  const [title, setTitle] = useState<string | null>(null)
  const [url, setUrl] = useState<string | null>(null)

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
        setTitle(tabs[0].title)
        setUrl(tabs[0].url)
      }
    })
  }, [])

  useEffect(() => {
    screenshot()
  }, [])

  async function postToArena() {
    // const publicUrl = await fetch(
    //   "https://are-na-screenshotter.vercel.app/api/upload",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({ image: base64Image })
    //   }
    // )
    //   .then((res) => res.json())
    //   .then((json) => json.data.publicUrl)

    fetch("http://localhost:5173/api/arena", {
      method: "POST",
      body: JSON.stringify({
        channelId: "tests-twjgqznfouc",
        source:
          "https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIyODM0MTIyMy9vcmlnaW5hbF84MTI0Y2Q1OGQxYTZmMjgzN2U2MTQ1ZTE4YmQ4MzU1Yy5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjI0MDAsImhlaWdodCI6MjQwMCwiZml0IjoiaW5zaWRlIiwid2l0aG91dEVubGFyZ2VtZW50Ijp0cnVlfSwid2VicCI6eyJxdWFsaXR5Ijo2NX0sImpwZWciOnsicXVhbGl0eSI6NjV9LCJyb3RhdGUiOm51bGx9fQ==",
        title: title,
        description: url
      })
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json)
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
        Take screenshot
      </button>
    </div>
  )
}

export default IndexPopup
