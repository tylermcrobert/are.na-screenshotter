import { useCaptureCtx } from "./CaptureCtx"

export default function CapturePreview() {
  const { screenshot } = useCaptureCtx()

  return (
    <div className="relative flex h-[220px] items-center justify-center bg-black p-5">
      {screenshot && (
        <img src={screenshot} className="h-full w-full object-contain" />
      )}
    </div>
  )
}
