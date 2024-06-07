import { useCaptureCtx } from "./CaptureCtx"

export default function CaptureMeta() {
  const { originTitle, hostName } = useCaptureCtx()
  return (
    <div className="flex flex-col justify-center h-[80px] text-center">
      <div className="font-bold">{originTitle}</div>
      <div className="text-gray-4">{hostName}</div>
    </div>
  )
}
