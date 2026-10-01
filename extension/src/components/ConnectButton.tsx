import { useState } from "react"

import { useCaptureCtx } from "./CaptureCtx"
import Spinner from "./Spinner"

export default function ConnectButton() {
  const {
    arena,
    screenshot,
    originUrl,
    originTitle,
    currentChannel,
    setPostedTo,
    setError
  } = useCaptureCtx()

  const [loading, setLoading] = useState(false)

  /**
   * Posts the screenshot to Are.na
   */
  function postToArena() {
    if (!currentChannel?.id) {
      setError("Please select a channel.")
      return
    }

    if (!screenshot || !originUrl || !originTitle) {
      setError("Missing screenshot, originUrl, or originTitle.")
      return
    }

    setLoading(true)
    setError(null)

    arena
      .postScreenshot(currentChannel.id, {
        screenshot: screenshot,
        originUrl: originUrl,
        originTitle: originTitle
      })
      .then(() => {
        setLoading(false)
        setPostedTo(currentChannel)
        setError(null)
      })
      .catch((e) => {
        setLoading(false)
        setError(e.message)
      })
  }

  return (
    <button
      className="btn-primary w-full"
      onClick={postToArena}
      disabled={loading}>
      {!loading ? <>Connect &rarr;</> : <Spinner />}
    </button>
  )
}
