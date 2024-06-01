import { useState } from "react"

import { ARENA_API_URL } from "~constants"

import Spinner from "./Spinner"

type ButtonRowProps = {
  screenshot: string
  originUrl: string
  originTitle: string
  channelId: string
  onError: (error: string) => void
  onSuccess: () => void
}

export default function ConnectButton({
  screenshot,
  originUrl,
  originTitle,
  channelId,
  onError,
  onSuccess
}: ButtonRowProps) {
  const [loading, setLoading] = useState(false)

  /**
   * Posts the screenshot to Are.na
   */
  async function postToArena() {
    setLoading(true)

    try {
      const url = `${ARENA_API_URL}/channels/${channelId}`

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
      console.log(e)
      setLoading(false)
      onError(e.message ? e.message : "An unexpected error occurred.")
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
