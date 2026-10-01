import type { Channel } from "@aredotna/sdk"
import { useEffect, useRef, useState } from "react"

import { useCaptureCtx } from "./CaptureCtx"
import Spinner from "./Spinner"

const VISIBILITY_STATUS_CLASS = {
  private: "status-private",
  public: "status-public",
  closed: "status-closed"
} as const

type ChannelListProps = {
  channels: Channel[]
  loading: boolean
  onLoadMore: () => void | Promise<void>
  hasMore: boolean
}

export default function ChannelList({
  channels,
  loading,
  onLoadMore,
  hasMore
}: ChannelListProps) {
  const { currentChannel, setCurrentChannel } = useCaptureCtx()
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={scrollRef}
      className={[
        channels.length > 4
          ? "pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-3 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-1"
          : "",
        "relative flex flex-col gap-channel-row-gap overflow-y-auto",
        "h-[calc((var(--spacing-channel-row-height)*5_+_var(--spacing-channel-row-gap)*4)_-_var(--spacing-channel-row-height)/2)]"
      ].join(" ")}>
      {channels.length ? (
        channels.map((channel) => (
          <label
            className={[
              VISIBILITY_STATUS_CLASS[channel.visibility],
              `flex h-channel-row-height shrink-0 cursor-pointer items-center gap-2 rounded-sm bg-status-1 px-2 text-nowrap text-status-3 ring-ring ring-inset has-focus-visible:ring-1`
            ].join(" ")}
            key={channel.id}>
            <input
              type="radio"
              name="channel"
              className="peer sr-only"
              onChange={() => setCurrentChannel(channel)}
              checked={currentChannel?.id === channel.id}
            />
            <div className="h-2.5 w-2.5 shrink-0 rounded-full border border-status-2 peer-checked:border-status-3 peer-checked:bg-status-3"></div>
            <div className="flex min-w-0 flex-1 gap-2">
              <span className="truncate">{channel.title}</span>
              <span>{channel.counts.contents}</span>
            </div>
            <div>{channel.owner.name}</div>
          </label>
        ))
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          {loading ? <Spinner /> : <span>No channels found</span>}
        </div>
      )}
      {hasMore ? (
        <LoadMoreSentinel
          scrollRef={scrollRef}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          channels={channels}
        />
      ) : null}
    </div>
  )
}

function LoadMoreSentinel({
  hasMore,
  onLoadMore,
  channels,
  scrollRef
}: {
  hasMore: boolean
  onLoadMore: () => void
  channels: Channel[]
  scrollRef: React.RefObject<HTMLDivElement>
}) {
  const endRef = useRef<HTMLDivElement>(null)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    if (!hasMore) return

    const root = scrollRef.current
    const target = endRef.current

    if (!target) return

    let cancelled = false
    let isInFlight = false

    function onIntersection(entries: IntersectionObserverEntry[]) {
      if (!entries[0]?.isIntersecting || isInFlight) return
      isInFlight = true
      setLoadingMore(true)

      Promise.resolve(onLoadMore()).finally(() => {
        isInFlight = false
        if (!cancelled) setLoadingMore(false)
      })
    }

    const observer = new IntersectionObserver(onIntersection, {
      root: root,
      rootMargin: "80px"
    })

    observer.observe(target)

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [hasMore, channels.length, onLoadMore])

  return (
    <div ref={endRef} className="flex shrink-0 justify-center py-2">
      {loadingMore ? <Spinner /> : null}
    </div>
  )
}
