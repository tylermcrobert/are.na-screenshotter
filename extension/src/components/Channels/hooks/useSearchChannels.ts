import type { Channel } from "@aredotna/sdk/dist/index.js"
import { useEffect, useState } from "react"

import { useCaptureCtx } from "~components/CaptureCtx"

import { useDebounce } from "./useDebounce"

/**
 * useSearchChannels
 * @description Handles the search functionality for channels
 */
export function useSearchChannels() {
  const { arena, setError, setCurrentChannel } = useCaptureCtx()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [allChannels, setAllChannels] = useState<Channel[]>([])

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  /**
   * When there's a search query, fetch every single channel
   */
  useEffect(() => {
    if (!debouncedSearchQuery.length || allChannels.length) return
    setSearchLoading(true)

    arena
      .getAllChannels()
      .then((res) => {
        setAllChannels(res)
        setError(null)
        setCurrentChannel(res[0] ?? null)
      })
      .catch((e) => {
        console.error(e)
        setError("There was an error fetching channels for search.")
      })
      .finally(() => {
        setSearchLoading(false)
      })
  }, [arena, debouncedSearchQuery, setError, setCurrentChannel])

  /**
   * Derrived filtered channels from the search query
   * @param query - The query to filter the channels by
   * @returns The filtered channels
   */
  function getFilteredChannels(query: string) {
    return allChannels.filter((channel) =>
      channel.title.toLowerCase().includes(query.toLowerCase())
    )
  }

  return {
    searchChannels: getFilteredChannels(debouncedSearchQuery),
    searchLoading,
    setSearchQuery,
    searchQuery,
    debouncedSearchQuery
  }
}
