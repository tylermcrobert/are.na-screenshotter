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
    <div
      style={{
        padding: 0
      }}>
      {loading ? <div>Loading...</div> : null}

      {base64Image && (
        <div
          style={{
            width: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
            padding: 8
          }}>
          <img src={base64Image} style={{ width: "100%" }} />
        </div>
      )}

      <button onClick={screenshot}>Take screenshot</button>
    </div>
  )
}

export default IndexPopup
