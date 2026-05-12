import { useCaptureCtx } from "./CaptureCtx"

export default function CaptureMeta() {
  const { originTitle, hostName } = useCaptureCtx()
  return (
    <div className="flex min-h-16 flex-1 flex-col justify-center text-center">
      <div className="font-bold">{originTitle}</div>
      <div className="text-gray-4">{hostName}</div>
    </div>
  )
}
