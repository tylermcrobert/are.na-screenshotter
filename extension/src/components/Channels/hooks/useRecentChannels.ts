import type { Channel } from "@aredotna/sdk/dist/index.js"
import { useEffect, useState } from "react"

import { useCaptureCtx } from "~components/CaptureCtx"

const PER_PAGE = 20

/**
 * useRecentChannels
 * @description Handles the recent channels functionality
 */
export function useRecentChannels() {
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
      .getRecentChannels({ per: PER_PAGE }, { signal: controller.signal })
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

  async function loadMore() {
    if (!recentChannels.hasMore) return

    const newChannels = await arena.getRecentChannels({
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
