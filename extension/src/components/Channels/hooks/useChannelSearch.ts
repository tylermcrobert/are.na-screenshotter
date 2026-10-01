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
 * @description Handles the search functionality for channels
 * @param fallback - The channel to select when the query is cleared
 */
export function useChannelSearch(fallback: Channel | null) {
  const { arena, setError, setCurrentChannel } = useCaptureCtx()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchLoading, setSearchLoading] = useState(true)
  const [allChannels, setAllChannels] = useState<Channel[]>([])

  useEffect(() => {
    arena
      .getAllChannels()
      .then((res) => {
        setAllChannels(res)
        setError(null)
      })
      .catch((e) => {
        console.error(e)
        setError("There was an error fetching channels for search.")
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
   * Updates the query and selects the fallback when cleared
   */
  function search(query: string) {
    setSearchQuery(query)
    if (!query) setCurrentChannel(fallback)
  }

  return {
    searchResults: filterChannels(allChannels, searchQuery),
    searchLoading,
    showSpinner: searchLoading && searchQuery.length > 0,
    searchQuery,
    search
  }
}
