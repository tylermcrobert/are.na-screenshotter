import { useEffect, useState } from "react"

import type { ArenaChannel } from "~lib/types"

import { useCaptureCtx } from "./CaptureCtx"
import ChannelList from "./ChannelList"
import Spinner from "./Spinner"

const SEARCH_DEBOUNCE_MS = 300

export default function Channels() {
  const { arena, currentChannel, setError, setCurrentChannel } = useCaptureCtx()

  const [recentChannels, setRecentChannels] = useState<ArenaChannel[]>([])
  const [searchChannels, setSearchChannels] = useState<ArenaChannel[] | null>(null)

  const [initialLoading, setInitialLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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

      <ChannelList
        channels={searchChannels === null ? recentChannels : searchChannels}
        currentChannel={currentChannel}
        initialLoading={initialLoading}
        onSelectChannel={setCurrentChannel}
      />
    </form>
  )
}
