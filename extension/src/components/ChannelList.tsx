import type { ArenaChannel } from "~lib/types"

import Spinner from "./Spinner"

const VISIBILITY_STATUS_CLASS = {
  private: "status-private",
  public: "status-public",
  closed: "status-closed"
} as const

type ChannelListProps = {
  channels: ArenaChannel[]
  currentChannel: ArenaChannel | null
  initialLoading: boolean
  onSelectChannel: (channel: ArenaChannel) => void
}

export default function ChannelList({
  channels,
  currentChannel,
  initialLoading,
  onSelectChannel
}: ChannelListProps) {
  return (
    <div
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
              `flex h-channel-row-height shrink-0 cursor-pointer items-center gap-2 rounded-sm bg-status-1 px-2 text-nowrap text-status-3`
            ].join(" ")}
            key={channel.id}>
            <input
              hidden
              type="radio"
              className="peer"
              onChange={() => onSelectChannel(channel)}
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
          {initialLoading ? <Spinner /> : <span>No channels found</span>}
        </div>
      )}
    </div>
  )
}
