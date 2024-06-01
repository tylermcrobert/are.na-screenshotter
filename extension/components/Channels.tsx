import { useEffect, useState } from "react"

import type { APIChannel } from "../../web/src/types"
import { ARENA_API_URL } from "../constants"
import Spinner from "./Spinner"

type ChannelsProps = {
  currentChannel: APIChannel
  onError: (error: string) => void
  setCurrentChannel: (channel: APIChannel) => void
}

export default function Channels({
  onError,
  setCurrentChannel,
  currentChannel
}: ChannelsProps) {
  const [channels, setChannels] = useState<APIChannel[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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
      setCurrentChannel(arenaJson.channels[0])
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

  useEffect(() => {
    if (searchQuery.length) {
      fetch(`${ARENA_API_URL}/search/channels/?q=${searchQuery}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          // Process the API response data here
        })
        .catch((error) => {
          console.log(error)
          onError("An error occurred while making the API call.")
        })
    }
  }, [searchQuery])

  return (
    <div className="relative flex flex-col h-[148px]">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white">
          <Spinner />
        </div>
      )}

      <form>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          className="border-gray-2 focus:border-gray-3 my-2 px-2 py-1 border w-full outline-none"
          placeholder="Search channels..."
        />
      </form>

      <form className="flex flex-col flex-1 divide-y divide-gray-1">
        {channels.length
          ? channels.map((channel) => (
              <label
                className={`flex flex-1 items-center gap-2 hover:bg-status-1 cursor-pointer status-${channel.status}`}
                key={channel.id}>
                <input
                  hidden
                  type="radio"
                  className="peer"
                  onChange={() => setCurrentChannel(channel)}
                  checked={currentChannel.id === channel.id}
                />

                <div className="border-gray-3 peer-checked:border-status-3 peer-checked:bg-status-3 border rounded-full w-2.5 h-2.5"></div>
                <div className="flex-1 text-status-3">{channel.title}</div>
                <div className="text-gray-4">{channel.length} Blocks</div>
              </label>
            ))
          : null}
      </form>
    </div>
  )
}
