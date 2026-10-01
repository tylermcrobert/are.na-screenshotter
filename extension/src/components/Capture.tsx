import { useState } from "react"

import { MESSAGE } from "~lib/messages"

import { useCaptureCtx } from "./CaptureCtx"
import CapturePreview from "./CapturePreview"
import Channels from "./Channels/Channels"
import Spinner from "./Spinner"

export default function Capture() {
  const { postedTo } = useCaptureCtx()

  return (
    <div className="flex h-window-height flex-col">
      <CapturePreview />

      <div className="flex h-bottom flex-col px-3">
        {postedTo ? <ConnectConfirm /> : <ConnectForm />}
      </div>
    </div>
  )
}

function ConnectForm() {
  const { originTitle, hostName, postToArena } = useCaptureCtx()

  const [loading, setLoading] = useState(false)

  async function onClick() {
    setLoading(true)
    try {
      await postToArena()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex min-h-16 flex-1 flex-col justify-center text-center">
        <div className="font-bold">{originTitle}</div>
        <div className="text-gray-4">{hostName}</div>
      </div>
      <Channels />
      <ButtonBar>
        <CloseButton />
        <button
          className="btn-primary w-full"
          onClick={onClick}
          disabled={loading}>
          {!loading ? <>Connect &rarr;</> : <Spinner />}
        </button>
      </ButtonBar>
    </>
  )
}

function ConnectConfirm() {
  const { postedTo, originTitle, hostName } = useCaptureCtx()

  return (
    <>
      <div className="mt-3 flex flex-1 flex-col justify-center text-center">
        <div className="mb-1 text-[15px] font-bold">
          Posted to {postedTo.title}.
        </div>
        <div className="text-gray-4">
          <div>{originTitle}</div>
          <div>{hostName}</div>
        </div>
      </div>

      <ButtonBar>
        <CloseButton />
        <a
          href={`https://are.na/channel/${postedTo.id}`}
          className="btn-primary w-full"
          target="_blank"
          rel="noreferrer">
          View channel &rarr;
        </a>
      </ButtonBar>
    </>
  )
}

function ButtonBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 flex gap-3 bg-white py-3">{children}</div>
  )
}

function CloseButton() {
  async function closeWindow() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.id) {
      await chrome.tabs.sendMessage(tab.id, { type: MESSAGE.CLOSE_PANEL })
    }
  }

  return (
    <button className="btn" onClick={closeWindow}>
      Close
    </button>
  )
}
