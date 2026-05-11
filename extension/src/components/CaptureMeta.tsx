import { useCaptureCtx } from "./CaptureCtx"

export default function CaptureMeta() {
  const { originTitle, hostName } = useCaptureCtx()
  return (
    <div className="flex h-[80px] flex-col justify-center text-center">
      <div className="font-bold">{originTitle}</div>
      <div className="text-gray-4">{hostName}</div>
    </div>
  )
}
