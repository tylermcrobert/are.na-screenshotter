import { useCaptureCtx } from "./CaptureCtx"

export default function ImageDisplay() {
  const { screenshot } = useCaptureCtx()

  return (
    <div className="relative flex justify-center items-center bg-black p-5 h-[220px]">
      {screenshot && (
        <img src={screenshot} className="w-full h-full object-contain" />
      )}
    </div>
  )
}
