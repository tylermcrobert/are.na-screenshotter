import type { Channel } from "@aredotna/sdk"

import { useCaptureCtx } from "~components/CaptureCtx"

const VISIBILITY_STATUS_CLASS = {
  private: "status-private",
  public: "status-public",
  closed: "status-closed"
} as const

export default function ChannelRow({ channel }: { channel: Channel }) {
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
