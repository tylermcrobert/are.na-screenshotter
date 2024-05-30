import { useEffect, useState } from "react"

import { ARENA_API_URL } from "../constants"

type ChannelsProps = {
  currentChannelId: string
  onError: (error: string) => void
  setCurrentChannel: (channelId: string) => void
}

export default function Channels({
  onError,
  setCurrentChannel,
  currentChannelId
}: ChannelsProps) {
  const [channels, setChannels] = useState<{ title: string; id: string }[]>([])
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

      /**
       * Throw error
       */
      if (!arenaResponse.ok) {
        const errorMessage = arenaJson.error
          ? `API Error: "${arenaJson.error}"`
          : "An unexpected error occurred posting to Are.na."

        throw new Error(errorMessage)
      }

      setLoading(false)
      setChannels(arenaJson.data.channels)
      setCurrentChannel(arenaJson.data.channels[0].id)
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
  }, [])

  return (
    <div className="relative flex flex-col border-b border-b-gray-2 divide-y divide-gray-2 h-[120px]">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white">
          Loading...
        </div>
      )}

      {channels.length
        ? channels.map((item) => (
            <label
              className="flex flex-1 items-center hover:bg-gray-1 cursor-pointer"
              key={item.id}>
              <input
                type="radio"
                className=""
                onChange={() => setCurrentChannel(item.id)}
                checked={currentChannelId === item.id}
              />
              {item.title}
            </label>
          ))
        : null}
    </div>
  )
}
