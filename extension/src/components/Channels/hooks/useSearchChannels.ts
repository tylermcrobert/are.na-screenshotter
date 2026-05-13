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
