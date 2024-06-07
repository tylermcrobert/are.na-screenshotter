import { useCaptureCtx } from "./CaptureCtx"
import ConnectButton from "./ConnectButton"

export default function CaptureButton() {
  const { postedTo } = useCaptureCtx()

  return (
    <div className="flex gap-2 m-3">
      {/* <button className="btn" onClick={closeWindow}>
        Close
      </button> */}

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
  )
}
