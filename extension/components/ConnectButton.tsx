import { useState } from "react"

import { ARENA_API_URL } from "~constants"
import { ApiReq } from "~lib/request"

import type { APIChannel } from "../../web/src/types"
import Spinner from "./Spinner"

type ButtonRowProps = {
  accessToken: string
  screenshot: string | null
  originUrl: string | null
  originTitle: string | null
  currentChannel: APIChannel | null
  onError: (error: string | null) => void
  onSuccess: () => void
}

export default function ConnectButton({
  accessToken,
  screenshot,
  originUrl,
  originTitle,
  currentChannel,
  onError,
  onSuccess
}: ButtonRowProps) {
  const [loading, setLoading] = useState(false)
  const api = new ApiReq(accessToken)

  /**
   * Posts the screenshot to Are.na
   */
  async function postToArena() {
    setLoading(true)
    onError(null)

    if (!currentChannel) {
      onError("Please select a channel.")
    }

    if (!screenshot || !originUrl || !originTitle) {
      onError("Missing screenshot, originUrl, or originTitle.")
      return
    }

    if (!currentChannel?.id) {
      onError("Please select a channel.")
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
        onSuccess()
        onError(null)
      })
      .catch((e) => {
        setLoading(false)
        onError(e.message)
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
