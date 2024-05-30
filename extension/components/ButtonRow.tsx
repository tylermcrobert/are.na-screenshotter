import { useState } from "react"

import { ARENA_API_URL, FPO_CHANNEL_ID } from "~constants"

type ButtonRowProps = {
  image: string
  originUrl: string
  originTitle: string
  onError: (error: string) => void
  onSuccess: () => void
  captureScreenshot: () => void
}

export default function ButtonRow({
  image,
  originUrl,
  originTitle,
  onError,
  onSuccess,
  captureScreenshot
}: ButtonRowProps) {
  const [loading, setLoading] = useState(true)

  /**
   * Posts the screenshot to Are.na
   */
  async function postToArena() {
    setLoading(true)

    try {
      const url = `${ARENA_API_URL}/channels/${FPO_CHANNEL_ID}`

      const arenaResponse = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          screenshot: image,
          title: originTitle,
          description: originUrl
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
    <div className="flex gap-2 py-2">
      <button className="w-full btn" onClick={postToArena}>
        {!loading ? <>Connect &rarr;</> : "Loading..."}
      </button>
      <button className="w-full btn" onClick={captureScreenshot}>
        Retake
      </button>
    </div>
  )
}
