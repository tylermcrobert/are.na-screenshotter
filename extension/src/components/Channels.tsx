import { useEffect, useState } from "react"

import type { ArenaChannel } from "~lib/types"

import { useCaptureCtx } from "./CaptureCtx"
import Spinner from "./Spinner"

const VISIBILITY_STATUS_CLASS = {
  private: "status-private",
  public: "status-public",
  closed: "status-closed"
}

const SEARCH_DEBOUNCE_MS = 300

export default function Channels() {
  const { arena, currentChannel, setError, setCurrentChannel } = useCaptureCtx()

  const [recentChannels, setRecentChannels] = useState<ArenaChannel[]>([])
  const [searchChannels, setSearchChannels] = useState<ArenaChannel[] | null>(null)

  const [initialLoading, setInitialLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const channels = searchChannels === null ? recentChannels : searchChannels

  /**
   * Fetches the user's channels
   */
  useEffect(() => {
    setInitialLoading(true)

    arena
      .getUserChannels()
      .then((res) => {
        setError(null)
        setCurrentChannel(res[0])
        setRecentChannels(res)
        setInitialLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setInitialLoading(false)
      })
  }, [])

  /**
   * Searching for channels (debounced; stale in-flight results are ignored)
   */
  useEffect(() => {
    if (!searchQuery.length) {
      setSearchChannels(null)
      setSearchLoading(false)
      return
    }

    setSearchLoading(true)
    let discarded = false

    const timeoutId = window.setTimeout(() => {
      arena
        .searchUserChannels(searchQuery)
        .then((res) => {
          if (discarded) return
          setError(null)
          setCurrentChannel(res[0])
          setSearchChannels(res)
          setSearchLoading(false)
        })
        .catch((e) => {
          if (discarded) return
          setError(e.message)
          setSearchLoading(false)
        })
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeoutId)
      discarded = true
    }
  }, [searchQuery])

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="relative mb-2">
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-center">
          {searchLoading ? <Spinner /> : null}
        </div>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          className="w-full rounded-sm border px-2 py-1 pr-8 placeholder:text-gray-4"
          placeholder="Search channels"
        />
      </div>

      <div
        className={[
          channels.length > 4
            ? "pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-3 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-1"
            : "",
          "relative flex flex-col gap-channel-row-gap overflow-y-auto",
          "h-[calc((var(--spacing-channel-row-height)*5_+_var(--spacing-channel-row-gap)*4)_-_var(--spacing-channel-row-height)/2)]"
        ].join(" ")}>
        {channels.length ? (
          channels.map((channel) => (
            <label
              className={[
                VISIBILITY_STATUS_CLASS[channel.visibility],
                `flex h-channel-row-height shrink-0 cursor-pointer items-center gap-2 rounded-sm bg-status-1 px-2 text-nowrap text-status-3`
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
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {initialLoading ? <Spinner /> : <span>No channels found</span>}
          </div>
        )}
      </div>
    </form>
  )
}
