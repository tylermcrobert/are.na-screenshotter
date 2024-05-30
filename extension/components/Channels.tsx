import { useEffect, useState } from "react"

import { ARENA_API_URL } from "../constants"

type ChannelsProps = {
  onError: (error: string) => void
}

export default function Channels({ onError }: ChannelsProps) {
  const [channels, setChannels] = useState<{ title: string }[]>([])
  const [loading, setLoading] = useState(false)

  /**
   * Gets the user's channels
   */
  async function getChannels() {
    setLoading(true)
    try {
      /**
       * Post to arena
       */

      const arenaResponse = await fetch(
        `${ARENA_API_URL}/users/tyler-mcrobert/channels`,
        { method: "GET" }
      )

      const arenaJson = await arenaResponse.json()

      console.log(arenaJson)

      /**
       * Throw error
       */
      if (!arenaResponse.ok) {
        const errorMessage = arenaJson.error
          ? `API Error: "${arenaJson.error}"`
          : "An unexpected error occurred posting to Are.na."

        throw new Error(errorMessage)
      }

      setChannels(arenaJson.data.channels)
    } catch (e) {
      /**
       * Catch error
       */
      console.log(e)
      setLoading(false)
      onError(e.message ? e.message : "An unexpected error occurred.")
    }
  }

  useEffect(() => {
    getChannels()
  })

  if (!channels.length) {
    return null
  }

  return (
    <div>
      {channels.map((item) => (
        <div className="p-1 border-b">{item.title}</div>
      ))}
    </div>
  )
}
