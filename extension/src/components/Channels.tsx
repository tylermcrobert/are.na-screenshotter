import { useEffect, useState } from "react"

import type { ArenaChannel } from "~lib/types"

import { useCaptureCtx } from "./CaptureCtx"
import Spinner from "./Spinner"

const VISIBILITY_STATUS_CLASS = {
  private: "status-private",
  public: "status-public",
  closed: "status-closed"
}

export default function Channels() {
  const { arena, currentChannel, setError, setCurrentChannel } = useCaptureCtx()

  const [recentChannels, setRecentChannels] = useState<ArenaChannel[]>([])
  const [searchChannels, setSearchChannels] = useState<ArenaChannel[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const channels = searchQuery ? searchChannels : recentChannels
  const isNoResults = searchQuery && !searchChannels.length

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
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        className="w-full rounded-sm border px-2 py-1 placeholder:text-gray-4"
        placeholder="Search channels"
      />

      <div className="relative">
        {(loading || isNoResults) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            {loading ? (
              <Spinner />
            ) : (
              <span className="text-gray-4">
                {isNoResults && "No results found."}
              </span>
            )}
          </div>
        )}

        <div className="flex min-h-[calc(var(--spacing-channel-row-height)*5+var(--spacing-channel-row-gap)*4)] flex-col gap-channel-row-gap">
          {channels.length
            ? channels.map((channel) => (
                <label
                  className={[
                    VISIBILITY_STATUS_CLASS[channel.visibility],
                    `flex h-channel-row-height cursor-pointer items-center gap-2 rounded-sm bg-status-1 px-2 text-nowrap text-status-3`
                  ].join(" ")}
                  key={channel.id}>
                  <input
                    hidden
                    type="radio"
                    className="peer"
                    onChange={() => setCurrentChannel(channel)}
                    checked={currentChannel?.id === channel.id}
                  />
                  <div className="h-2.5 w-2.5 shrink-0 rounded-full border border-status-2 peer-checked:border-status-3 peer-checked:bg-status-3"></div>
                  <div className="flex min-w-0 flex-1 gap-2">
                    <span className="truncate">{channel.title}</span>
                    <span>{channel.counts.contents}</span>
                  </div>
                  <div>{channel.owner.name}</div>
                </label>
              ))
            : null}
        </div>
      </div>
    </form>
  )
}
