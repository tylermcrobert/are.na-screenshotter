import { useCaptureCtx } from "./CaptureCtx"
import ConnectButton from "./ConnectButton"

export default function CaptureButton() {
  const { postedTo } = useCaptureCtx()

  return (
    <div className="m-3 flex gap-2">
      {/* <button className="btn" onClick={closeWindow}>
        Close
      </button> */}

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
  )
}
