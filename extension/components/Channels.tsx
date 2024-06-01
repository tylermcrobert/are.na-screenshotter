import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type { APIChannel } from "../../web/src/types"
import { ARENA_API_URL } from "../constants"
import Spinner from "./Spinner"

type ChannelsProps = {
  currentChannel: APIChannel | null
  onError: (error: string) => void
  setCurrentChannel: (channel: APIChannel) => void
  accessToken: string
}

export default function Channels({
  onError,
  setCurrentChannel,
  currentChannel,
  accessToken
}: ChannelsProps) {
  const [recentChannels, setRecentChannels] = useState<APIChannel[]>([])
  const [searchChannels, setSearchChannels] = useState<APIChannel[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const channels = searchQuery ? searchChannels : recentChannels

  /**
   * Gets the user's channels
   */
  async function getChannels() {
    setLoading(true)

    try {
      /**
       * Post to arena
       */

      const response = await sendToBackground({
        name: "corsRequest",
        body: {
          url: `${ARENA_API_URL}/users/tyler-mcrobert/channels`,
          options: {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        }
      })

      setLoading(false)
      setRecentChannels(response.channels)
      setCurrentChannel(response.channels[0])
    } catch (e) {
      /**
       * Catch error
       */
      console.log(e)
      const errMessage = (e as any).message
      onError(errMessage || "An unexpected error occurred.")
      setLoading(false)
    }
  }

  useEffect(() => {
    getChannels()
  }, [])

  async function executeSearch() {
    try {
      const response = await sendToBackground({
        name: "corsRequest",
        body: {
          url: `${ARENA_API_URL}/search/channels/?q=${searchQuery}`,
          options: {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        }
      })

      setSearchChannels(response.channels)
    } catch (e) {
      console.log(e)
      onError("An error occurred while making the API call.")
    }
  }

  useEffect(() => {
    if (searchQuery.length) {
      executeSearch()
    } else {
      setSearchChannels([])
    }
  }, [searchQuery])

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          className="border-gray-2 focus:border-gray-3 my-2 px-2 py-1 border w-full placeholder:text-gray-4 outline-none"
          placeholder="Search channels..."
        />
      </form>

      <form className="relative flex-1 divide-y divide-gray-1 h-[100px]">
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white">
            <Spinner />
          </div>
        )}

        {channels.length
          ? channels.map((channel) => (
              <label
                className={`flex flex-1 items-center gap-2 hover:bg-status-1 cursor-pointer status-${channel.status} h-[20px]`}
                key={channel.id}>
                <input
                  hidden
                  type="radio"
                  className="peer"
                  onChange={() => setCurrentChannel(channel)}
                  checked={currentChannel?.id === channel.id}
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
