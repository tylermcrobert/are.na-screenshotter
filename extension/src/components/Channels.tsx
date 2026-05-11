import { useEffect, useState } from "react"

import type { ArenaChannel } from "~lib/types"

import { useCaptureCtx } from "./CaptureCtx"
import Spinner from "./Spinner"

export default function Channels() {
  const { arena, currentChannel, setError, setCurrentChannel } = useCaptureCtx()

  const [recentChannels, setRecentChannels] = useState<ArenaChannel[]>([])
  const [searchChannels, setSearchChannels] = useState<ArenaChannel[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const channels = searchQuery ? searchChannels : recentChannels
  const isEmptySearch = searchQuery && !searchChannels.length

  /**
   * Fetches the user's channels
   */
  useEffect(() => {
    setLoading(true)

    arena
      .getUserChannels()
      .then((res) => {
        setError(null)
        setCurrentChannel(res[0])
        setRecentChannels(res)
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  /**
   * Searching for channels
   */
  useEffect(() => {
    if (searchQuery.length) {
      setLoading(true)

      arena
        .searchUserChannels(searchQuery)
        .then((res) => {
          setError(null)
          setLoading(false)
          setCurrentChannel(res[0])
          setSearchChannels(res)
          setLoading(false)
        })
        .catch((e) => {
          setError(e.message)
          setLoading(false)
        })
    } else {
      setSearchChannels([])
    }
  }, [searchQuery])

  return (
    <div className="flex flex-col flex-1 gap-3">
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          className="focus:border-gray-3 px-2 py-1 border rounded-sm w-full placeholder:text-gray-4 outline-hidden"
          placeholder="Search channels"
        />
      </form>

      <form className="relative flex flex-col flex-1">
        {(loading || isEmptySearch) && (
          <div className="absolute inset-0 flex justify-center items-center bg-white">
            {loading ? (
              <Spinner />
            ) : (
              <span className="text-gray-4">
                {isEmptySearch && "No results found."}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col flex-1">
          {channels.length
            ? channels.map((channel) => (
                <label
                  className={`flex flex-1 items-center gap-2 hover:bg-status-1 cursor-pointer status-${channel.visibility} flex-1`}
                  key={channel.id}>
                  <input
                    hidden
                    type="radio"
                    className="peer"
                    onChange={() => setCurrentChannel(channel)}
                    checked={currentChannel?.id === channel.id}
                  />
                  <div className="peer-checked:border-status-3 peer-checked:bg-status-3 border rounded-full w-2.5 h-2.5"></div>
                  <div className="flex-1 text-status-3">{channel.title}</div>
                  <div className="text-gray-4">
                    {channel.counts.contents} Blocks
                  </div>
                </label>
              ))
            : null}
        </div>
      </form>
    </div>
  )
}
