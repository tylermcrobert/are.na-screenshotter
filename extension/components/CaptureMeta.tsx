import { useCaptureCtx } from "./CaptureCtx"

export default function CaptureMeta() {
  const { originTitle, hostName } = useCaptureCtx()
  return (
    <div className="border-gray-2 border-y py-5 text-center">
      <div className="font-bold">{originTitle}</div>
      <div className="text-gray-4">{hostName}</div>
    </div>
  )
}
