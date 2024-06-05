import { useState } from "react"

import { useCaptureCtx } from "./CaptureCtx"
import Spinner from "./Spinner"

export default function ConnectButton() {
  const {
    api,
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
  async function postToArena() {
    setLoading(true)
    setError(null)

    if (!currentChannel) {
      setError("Please select a channel.")
    }

    if (!screenshot || !originUrl || !originTitle) {
      setError("Missing screenshot, originUrl, or originTitle.")
      return
    }

    if (!currentChannel?.id) {
      setError("Please select a channel.")
      return
    }

    api
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
      className="flex justify-center w-full align-center btn"
      onClick={postToArena}>
      {!loading ? <>Connect &rarr;</> : <Spinner />}
    </button>
  )
}
