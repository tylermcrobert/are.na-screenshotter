import type { Channel } from "@aredotna/sdk/dist/index.js"
import { useEffect, useRef, useState } from "react"

import { useCaptureCtx } from "./CaptureCtx"
import ChannelList from "./ChannelList"
import Spinner from "./Spinner"

const SEARCH_DEBOUNCE_MS = 300

export default function Channels() {
  const { arena, currentChannel, setError, setCurrentChannel } = useCaptureCtx()

  const recentChannels = useRef<Channel[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [initialLoading, setInitialLoading] = useState(true)

  const [searchLoading, setSearchLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  /**
   * Fetches the user's channels
   */
  useEffect(() => {
    arena
      .getUserChannels()
      .then((res) => {
        recentChannels.current = res.data

        setError(null)
        setCurrentChannel(res.data[0] ?? null)
        setChannels(res.data)
      })
      .catch((e) => {
        setError(e.message)
      })
      .finally(() => {
        setInitialLoading(false)
      })
  }, [])

  /**
   * Searching for channels (debounced; stale in-flight results are ignored)
   */
  useEffect(() => {
    if (!searchQuery.length) {
      setChannels(recentChannels.current)
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
          setCurrentChannel(res[0] ?? null)
          setChannels(res)
        })
        .catch((e) => {
          if (discarded) return
          setError(e.message)
        })
        .finally(() => {
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
        channels={channels}
        currentChannel={currentChannel}
        initialLoading={initialLoading}
        onSelectChannel={setCurrentChannel}
      />
    </form>
  )
}
