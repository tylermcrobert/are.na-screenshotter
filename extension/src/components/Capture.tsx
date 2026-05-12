import { useCaptureCtx } from "./CaptureCtx"
import CaptureMeta from "./CaptureMeta"
import CapturePreview from "./CapturePreview"
import Channels from "./Channels"
import ConnectButton from "./ConnectButton"

export default function Capture() {
  const { postedTo, originTitle, hostName } = useCaptureCtx()

  function closeWindow() {
    void chrome.runtime.sendMessage({ type: "closePanel" })
  }

  return (
    <div className="flex h-window-height flex-col">
      <CapturePreview />

      <div className="flex h-bottom flex-col px-3">
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

        <div className="sticky bottom-0 flex gap-3 bg-white py-3">
          <button className="btn" onClick={closeWindow}>
            Close
          </button>

          {!postedTo ? (
            <ConnectButton />
          ) : (
            <a
              href={`https://are.na/channel/${postedTo.id}`}
              className="btn-primary w-full"
              target="_blank">
              View channel &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
