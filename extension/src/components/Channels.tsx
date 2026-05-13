import type { Channel } from "@aredotna/sdk/dist/index.js"
import { useEffect, useRef, useState } from "react"

import { useDebounce } from "~hooks/useDebounce"

import { useCaptureCtx } from "./CaptureCtx"
import ChannelList from "./ChannelList"
import Spinner from "./Spinner"

const PER_PAGE = 20

/**
 * useRecentChannels
 * @description Handles the recent channels functionality
 */
function useRecentChannels() {
  const { arena, setError, setCurrentChannel } = useCaptureCtx()
  const [initialLoading, setInitialLoading] = useState(true)
  const [recentChannels, setRecentChannels] = useState<{
    items: Channel[]
    loadingMore: boolean
    hasMore: boolean
    loadingInitial: boolean
  }>({
    items: [],
    loadingMore: false,
    hasMore: false,
    loadingInitial: true
  })

  useEffect(() => {
    const controller = new AbortController()

    arena
      .getUserChannels({ per: PER_PAGE }, { signal: controller.signal })
      .then((res) => {
        setError(null) // TODO: this doesn't go anywhere
        setCurrentChannel(res.data[0] ?? null)
        setRecentChannels((prev) => ({
          ...prev,
          items: res.data,
          hasMore: res.meta.total_count > res.data.length
        }))
      })
      .catch((e) => {
        if (controller.signal.aborted) return
        setError(e.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setInitialLoading(false)
      })

    return () => controller.abort()
  }, [arena, setError, setCurrentChannel])

  /**
   * loadMore
   * @description Loads more channels
   */
  async function loadMore() {
    if (!recentChannels.hasMore) return

    const newChannels = await arena.getUserChannels({
      page: recentChannels.items.length / PER_PAGE + 1,
      per: PER_PAGE
    })

    setRecentChannels((prev) => ({
      ...prev,
      items: [...prev.items, ...newChannels.data],
      hasMore: prev.items.length + newChannels.data.length < newChannels.meta.total_count
    }))
  }

  return { recentChannels, initialLoading, loadMore }
}

/**
 * useSearchChannels
 * @description Handles the search functionality for channels
 */
function useSearchChannels() {
  const { arena, setError, setCurrentChannel } = useCaptureCtx()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [searchChannels, setSearchChannels] = useState<Channel[]>([])

  useEffect(() => {
    if (!debouncedSearchQuery.length) return

    const controller = new AbortController()
    setSearchLoading(true)

    arena
      .searchUserChannels(debouncedSearchQuery, { signal: controller.signal })
      .then((res) => {
        setError(null)
        setSearchLoading(false)
        setCurrentChannel(res[0] ?? null)
        setSearchChannels(res)
      })
      .catch((e) => {
        if (controller.signal.aborted) return
        setError(e.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setSearchLoading(false)
      })

    return () => controller.abort()
  }, [arena, debouncedSearchQuery, setError, setCurrentChannel])

  return {
    searchChannels,
    searchLoading,
    setSearchQuery,
    searchQuery,
    debouncedSearchQuery,
    setSearchLoading
  }
}

export default function Channels() {
  const { currentChannel, setCurrentChannel } = useCaptureCtx()
  const { recentChannels, initialLoading, loadMore } = useRecentChannels()
  const {
    //
    searchChannels,
    searchLoading,
    setSearchQuery,
    searchQuery,
    debouncedSearchQuery
  } = useSearchChannels()

  const showingSearchResults = debouncedSearchQuery.length > 0 && !searchLoading

  return (
    <div>
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
        onLoadMore={loadMore}
        hasMore={showingSearchResults ? false : recentChannels.hasMore}
        channels={showingSearchResults ? searchChannels : recentChannels.items}
        currentChannel={currentChannel}
        initialLoading={initialLoading}
        onSelectChannel={setCurrentChannel}
      />
    </div>
  )
}
