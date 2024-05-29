import { useEffect, useState } from "react"

import "./style.css"

function IndexPopup() {
  const [loading, setLoading] = useState(false)
  const [base64Image, setBase64Image] = useState<string | null>(null)

  async function screenshot() {
    setLoading(true)

    const screenshot = await chrome.tabs.captureVisibleTab()
    setBase64Image(screenshot)

    setLoading(false)
  }

  useEffect(() => {
    screenshot()
  }, [])

  return (
    <div className="flex flex-col gap-2 p-2 w-60">
      {base64Image && (
        <div className="flex justify-center items-center border-gray-300 bg-gray-200 border aspect-square">
          <img src={base64Image} className="w-full" />
        </div>
      )}

      <button
        onClick={screenshot}
        disabled={loading}
        className="border-gray-200 p-2 border w-full font-bold text-center">
        Take screenshot
      </button>
    </div>
  )
}

export default IndexPopup
