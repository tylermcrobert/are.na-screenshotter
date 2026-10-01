import type { Channel } from "@aredotna/sdk"
import { useCallback, useState } from "react"

import { useCaptureCtx } from "~components/CaptureCtx"

import { useDebounce } from "./useDebounce"

/**
 * useChannelSearch
 * @description Handles the search functionality for channels
 */
export function useChannelSearch() {
  const { arena, setError, setCurrentChannel } = useCaptureCtx()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [allChannels, setAllChannels] = useState<Channel[]>([])

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const fetchAllChannels = useCallback(async () => {
    setSearchLoading(true)

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

  /**
   * Derived filtered channels from the search query
   * @param query - The query to filter the channels by
   * @returns The filtered channels
   */
  function getFilteredChannels(query: string) {
    return allChannels.filter((channel) =>
      channel.title.toLowerCase().includes(query.toLowerCase())
    )
  }

  /**
   * Updates the query and selects the top match
   */
  function search(query: string) {
    setSearchQuery(query)
    const [topMatch] = getFilteredChannels(query)
    if (query && topMatch) setCurrentChannel(topMatch)
  }

  return {
    searchResults: getFilteredChannels(debouncedSearchQuery),
    searchLoading,
    showSpinner: searchLoading && searchQuery.length > 0,
    searchQuery,
    debouncedSearchQuery,
    search,
    fetchAllChannels
  }
}
