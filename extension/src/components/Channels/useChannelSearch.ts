import type { Channel } from "@aredotna/sdk"
import { useEffect, useState } from "react"

import { useCaptureCtx } from "~components/CaptureCtx"

function filterChannels(channels: Channel[], query: string) {
  return channels.filter((channel) =>
    channel.title.toLowerCase().includes(query.toLowerCase())
  )
}

/**
 * useChannelSearch
 * @description Loads the user's channels and filters them by the search query.
 * Shows the most recent channels first, then swaps in the full list once it loads.
 */
export function useChannelSearch() {
  const { arena, setError, setCurrentChannel } = useCaptureCtx()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchLoading, setSearchLoading] = useState(true)
  const [allChannels, setAllChannels] = useState<Channel[]>([])

  useEffect(() => {
    arena
      .getRecentChannels()
      .then((res) => {
        setAllChannels((prev) => (prev.length ? prev : res))
        setCurrentChannel((current) => current ?? res[0] ?? null)
      })
      .catch((e) => console.error(e))
  }, [arena, setCurrentChannel])

  useEffect(() => {
    arena
      .getAllChannels()
      .then((res) => {
        setAllChannels(res)
        setError(null)
      })
      .catch((e) => {
        console.error(e)
        setError("There was an error fetching channels.")
      })
      .finally(() => {
        setSearchLoading(false)
      })
  }, [arena, setError])

  useEffect(() => {
    if (searchQuery) {
      setCurrentChannel(filterChannels(allChannels, searchQuery)[0] ?? null)
    }
  }, [allChannels, searchQuery, setCurrentChannel])

  /**
   * Updates the query and selects the most recent channel when cleared
   */
  function search(query: string) {
    setSearchQuery(query)
    if (!query) setCurrentChannel(allChannels[0] ?? null)
  }

  return {
    searchResults: filterChannels(allChannels, searchQuery),
    searchLoading,
    showSpinner: searchLoading && searchQuery.length > 0,
    searchQuery,
    search
  }
}
