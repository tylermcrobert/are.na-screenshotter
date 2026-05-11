import { useEffect } from "react"

import CaptureBottom from "./CaptureBottom"
import { useCaptureCtx } from "./CaptureCtx"
import CaptureMeta from "./CaptureMeta"
import Channels from "./Channels"
import ConnectButton from "./ConnectButton"
import ImageDisplay from "./ImageDisplay"

export default function Capture() {
  const { postedTo, originTitle, hostName } = useCaptureCtx()

  function closeWindow() {
    window.close()
  }

  return (
    <div className="flex h-[480px] flex-col">
      <ImageDisplay />

      <div className="flex h-[260px] flex-col px-3">
        {!!postedTo ? (
          <div className="mt-3 flex flex-1 flex-col justify-center text-center">
            <div className="mb-1 text-[15px] font-bold">
              Posted to {postedTo.title}.
            </div>
            <div className="text-gray-4">
              <div>{originTitle}</div>
              <div>{hostName}</div>
            </div>
          </div>
        ) : (
          <>
            <CaptureMeta />
            <Channels />
          </>
        )}

        <div className="my-3 flex gap-3">
          <button className="btn" onClick={closeWindow}>
            Close
          </button>

          {!postedTo ? (
            <ConnectButton />
          ) : (
            <a
              href={`https://are.na/channel/${postedTo.id}`}
              className="btn w-full"
              target="_blank">
              View channel &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
