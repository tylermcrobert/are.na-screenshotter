import { useEffect, useState } from "react"

import "./style.css"

import { log } from "console"

function IndexPopup() {
  const [loading, setLoading] = useState(false)
  const [base64Image, setBase64Image] = useState<string | null>(null)
  // const [publicUrl, setPublicUrl] = useState<string | null>(null)

  async function screenshot() {
    setLoading(true)

    const screenshot = await chrome.tabs.captureVisibleTab()
    setBase64Image(screenshot)

    setLoading(false)
  }

  useEffect(() => {
    screenshot()
  }, [])

  async function postToArena() {
    const publicUrl = await fetch(
      "https://are-na-screenshotter.vercel.app/api/upload",
      {
        method: "POST",
        body: JSON.stringify({ image: base64Image })
      }
    )
      .then((res) => res.json())
      .then((json) => json.data.publicUrl)

    fetch("http://localhost:5173/api/arena", {
      method: "POST"
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
