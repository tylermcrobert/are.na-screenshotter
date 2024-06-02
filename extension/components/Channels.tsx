import type Arena from "are.na"
import { useEffect, useState } from "react"

import { useCaptureCtx } from "./CaptureCtx"
import Spinner from "./Spinner"

export default function Channels() {
  const { currentChannel, setError, setCurrentChannel, api } = useCaptureCtx()

  const [recentChannels, setRecentChannels] = useState<Arena.Channel[]>([])
  const [searchChannels, setSearchChannels] = useState<Arena.Channel[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const channels = searchQuery ? searchChannels : recentChannels
  const isEmptySearch = searchQuery && !searchChannels.length

  /**
   * Fetches the user's channels
   */
  useEffect(() => {
    setLoading(true)

    api
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

      api
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
