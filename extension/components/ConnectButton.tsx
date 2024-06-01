import { useState } from "react"

import { ARENA_API_URL } from "~constants"

import type { APIChannel } from "../../web/src/types"
import Spinner from "./Spinner"

type ButtonRowProps = {
  screenshot: string | null
  originUrl: string | null
  originTitle: string | null
  currentChannel: APIChannel | null
  onError: (error: string | null) => void
  onSuccess: () => void
}

export default function ConnectButton({
  screenshot,
  originUrl,
  originTitle,
  currentChannel,
  onError,
  onSuccess
}: ButtonRowProps) {
  const [loading, setLoading] = useState(false)

  /**
   * Posts the screenshot to Are.na
   */
  async function postToArena() {
    if (!currentChannel) {
      onError("Please select a channel.")
    }

    setLoading(true)

    try {
      const url = `${ARENA_API_URL}/channels/${currentChannel?.id}`

      const arenaResponse = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          screenshot,
          originUrl,
          originTitle
        })
      })

      const arenaJson = await arenaResponse.json()

      if (!arenaResponse.ok) {
        const errorMessage = arenaJson
          ? `API Error: "${arenaJson.error}"`
          : "An unexpected error occurred posting to Are.na."

        throw new Error(errorMessage)
      }

      setLoading(false)
      onSuccess()
      onError(null)
    } catch (e) {
      const errMesssage = e as any
      console.log(e)
      setLoading(false)
      onError(errMesssage || "An unexpected error occurred.")
    }
  }

  return (
    <button
      className="flex justify-center w-full align-center btn"
      onClick={postToArena}>
      {!loading ? <>Connect &rarr;</> : <Spinner />}
    </button>
  )
}
