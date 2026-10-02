import type { Channel } from "@aredotna/sdk"
import { useEffect, useRef, useState } from "react"

import Spinner from "~components/Spinner"

import ChannelRow from "./ChannelRow"

const PAGE_SIZE = 20

const LIST_CLASS =
  "relative flex h-[calc((var(--spacing-channel-row-height)*5_+_var(--spacing-channel-row-gap)*4)_-_var(--spacing-channel-row-height)/2)] flex-col gap-channel-row-gap overflow-y-auto"

const SCROLLBAR_CLASS =
  "pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-3 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-1"

type ChannelListProps = {
  channels: Channel[]
  loading: boolean
}

export default function ChannelList({ channels, loading }: ChannelListProps) {
  const { scrollRef, endRef, visibleChannels, hasMore } = useLoadMore(channels)

  return (
    <div
      ref={scrollRef}
      className={
        channels.length > 4 ? `${LIST_CLASS} ${SCROLLBAR_CLASS}` : LIST_CLASS
      }>
      {channels.length ? (
        visibleChannels.map((channel) => (
          <ChannelRow key={channel.id} channel={channel} />
        ))
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          {loading ? <Spinner /> : <span>No channels found</span>}
        </div>
      )}

      {hasMore ? <div ref={endRef} className="shrink-0" /> : null}
    </div>
  )
}

/**
 * useLoadMore
 * @description Reveals channels a page at a time as the end of the list scrolls into view
 */
function useLoadMore(channels: Channel[]) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const hasMore = visibleCount < channels.length

  useEffect(() => {
    const target = endRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisibleCount((count) => count + PAGE_SIZE)
      },
      { root: scrollRef.current, rootMargin: "80px" }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [hasMore, visibleCount])

  return {
    scrollRef,
    endRef,
    visibleChannels: channels.slice(0, visibleCount),
    hasMore
  }
}
