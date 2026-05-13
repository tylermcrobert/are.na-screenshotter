import type { Channel } from "@aredotna/sdk/dist/index.js"
import { useEffect, useRef, useState } from "react"

import { useDebounce } from "~hooks/useDebounce"

import { useCaptureCtx } from "./CaptureCtx"
import ChannelList from "./ChannelList"
import Spinner from "./Spinner"

const PER_PAGE = 20

export default function Channels() {
  const { arena, currentChannel, setError, setCurrentChannel } = useCaptureCtx()

  const recentChannels = useRef<Channel[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [initialLoading, setInitialLoading] = useState(true)

  const [searchLoading, setSearchLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    const controller = new AbortController()

    arena
      .getUserChannels({ per: PER_PAGE }, { signal: controller.signal })
      .then((res) => {
        recentChannels.current = res.data

        setError(null)
        setCurrentChannel(res.data[0] ?? null)
        setChannels(res.data)
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

  useEffect(() => {
    if (!debouncedSearchQuery.length) return

    const controller = new AbortController()

    arena
      .searchUserChannels(debouncedSearchQuery, { signal: controller.signal })
      .then((res) => {
        setError(null)
        setCurrentChannel(res[0] ?? null)
        setChannels(res)
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

  async function loadMore() {
    if (!debouncedSearchQuery.length) {
      const newChannels = await arena.getUserChannels({
        page: channels.length / PER_PAGE + 1,
        per: PER_PAGE
      })

      setChannels((prev) => [...prev, ...newChannels.data])
    }
  }

  return (
    <div>
      <div className="relative mb-2">
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-center">
          {searchLoading ? <Spinner /> : null}
        </div>
        <input
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)

            if (!e.target.value.length) {
              setSearchLoading(false)
              setChannels(recentChannels.current)
              setCurrentChannel(recentChannels.current[0] ?? null)
            } else {
              setSearchLoading(true)
            }
          }}
          type="text"
          className="w-full rounded-sm border px-2 py-1 pr-8 placeholder:text-gray-4"
          placeholder="Search channels"
        />
      </div>

      <ChannelList
        onLoadMore={loadMore}
        hasMore={channels.length % 20 === 0}
        channels={channels}
        currentChannel={currentChannel}
        initialLoading={initialLoading}
        onSelectChannel={setCurrentChannel}
      />
    </div>
  )
}
