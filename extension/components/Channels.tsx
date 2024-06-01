import { useEffect, useState } from "react"

import type { APIChannel } from "../../web/src/types"
import { ARENA_API_URL } from "../constants"
import Spinner from "./Spinner"

type ChannelsProps = {
  currentChannelId: string
  onError: (error: string) => void
  setCurrentChannel: (channelId: string) => void
}

type Channel = {
  title: string
  id: string
  status: string
  length: number
}

export default function Channels({
  onError,
  setCurrentChannel,
  currentChannelId
}: ChannelsProps) {
  const [channels, setChannels] = useState<Channel[]>([])
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
      setChannels(arenaJson.channels)
      setCurrentChannel(arenaJson.channels[0].id)
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
    <div className="relative flex flex-col border-b border-b-gray-2 divide-y divide-gray-1 h-[120px]">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white">
          <Spinner />
        </div>
      )}

      {channels.length
        ? channels.map((item) => (
            <label
              className={`flex flex-1 items-center gap-2 hover:bg-status-1 cursor-pointer status-${item.status}`}
              key={item.id}>
              <input
                hidden
                type="radio"
                className="peer"
                onChange={() => setCurrentChannel(item.id)}
                checked={currentChannelId === item.id}
              />

              <div className="border-gray-3 peer-checked:border-status-3 peer-checked:bg-status-3 border rounded-full w-2.5 h-2.5"></div>
              <div className="flex-1 text-status-3">{item.title}</div>
              <div className="text-gray-4">{item.length} Blocks</div>
            </label>
          ))
        : null}
    </div>
  )
}
