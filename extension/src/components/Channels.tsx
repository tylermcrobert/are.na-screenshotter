import type { Channel } from "@aredotna/sdk/dist/index.js"
import { useEffect, useRef, useState } from "react"

import { useDebounce } from "~hooks/useDebounce"

import { useCaptureCtx } from "./CaptureCtx"
import ChannelList from "./ChannelList"
import Spinner from "./Spinner"

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
      .getUserChannels({ signal: controller.signal })
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
  }, [])

  useEffect(() => {
    if (!debouncedSearchQuery.length) {
      setSearchLoading(false)
      return
    }

    const controller = new AbortController()
    setSearchLoading(true)

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
  }, [debouncedSearchQuery])

  return (
    <form>
      <div className="relative mb-2">
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-center">
          {searchLoading ? <Spinner /> : null}
        </div>
        <input
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)

            if (!e.target.value.length) {
              setChannels(recentChannels.current)
              setCurrentChannel(recentChannels.current[0] ?? null)
            }
          }}
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
