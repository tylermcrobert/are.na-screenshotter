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
    <div className="flex flex-col h-[480px]">
      <ImageDisplay />

      <div className="flex flex-col px-3 h-[260px]">
        {!!postedTo ? (
          <div className="flex flex-col flex-1 justify-center mt-3 text-center">
            <div className="mb-1 font-bold text-[15px]">
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

        <div className="flex gap-3 my-3">
          <button className="btn" onClick={closeWindow}>
            Close
          </button>

          {!postedTo ? (
            <ConnectButton />
          ) : (
            <a
              href={`https://are.na/channel/${postedTo.id}`}
              className="w-full btn"
              target="_blank">
              View channel &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
