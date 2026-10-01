import type { Channel } from "@aredotna/sdk"
import { useEffect, useRef, useState } from "react"

import { useCaptureCtx } from "./CaptureCtx"
import Spinner from "./Spinner"

const LIST_CLASS =
  "relative flex h-[calc((var(--spacing-channel-row-height)*5_+_var(--spacing-channel-row-gap)*4)_-_var(--spacing-channel-row-height)/2)] flex-col gap-channel-row-gap overflow-y-auto"

const SCROLLBAR_CLASS =
  "pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-3 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-1"

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
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={scrollRef}
      className={
        channels.length > 4 ? `${LIST_CLASS} ${SCROLLBAR_CLASS}` : LIST_CLASS
      }>
      {channels.length ? (
        channels.map((channel) => (
          <ChannelRow key={channel.id} channel={channel} />
        ))
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          {loading ? <Spinner /> : <span>No channels found</span>}
        </div>
      )}

      {hasMore ? (
        <LoadMore
          scrollRef={scrollRef}
          onLoadMore={onLoadMore}
          itemCount={channels.length}
        />
      ) : null}
    </div>
  )
}

const VISIBILITY_STATUS_CLASS = {
  private: "status-private",
  public: "status-public",
  closed: "status-closed"
} as const

function ChannelRow({ channel }: { channel: Channel }) {
  const { currentChannel, setCurrentChannel } = useCaptureCtx()

  return (
    <label
      className={`${VISIBILITY_STATUS_CLASS[channel.visibility]} flex h-channel-row-height shrink-0 cursor-pointer items-center gap-2 rounded-sm bg-status-1 px-2 text-nowrap text-status-3 ring-ring ring-inset has-focus-visible:ring-1`}>
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
  )
}

function LoadMore({
  onLoadMore,
  itemCount,
  scrollRef
}: {
  onLoadMore: () => void | Promise<void>
  itemCount: number
  scrollRef: React.RefObject<HTMLDivElement | null>
}) {
  const endRef = useRef<HTMLDivElement>(null)
  const onLoadMoreRef = useRef(onLoadMore)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore
  })

  useEffect(() => {
    const target = endRef.current
    if (!target) return

    let active = true
    let loadingPage = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || loadingPage) return
        loadingPage = true
        setLoading(true)

        Promise.resolve(onLoadMoreRef.current()).finally(() => {
          loadingPage = false
          if (active) setLoading(false)
        })
      },
      { root: scrollRef.current, rootMargin: "80px" }
    )

    observer.observe(target)

    return () => {
      active = false
      observer.disconnect()
    }
  }, [itemCount, scrollRef])

  return (
    <div ref={endRef} className="flex shrink-0 justify-center py-2">
      {loading ? <Spinner /> : null}
    </div>
  )
}
