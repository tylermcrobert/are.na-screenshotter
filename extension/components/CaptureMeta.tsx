type CaptureMetaProps = {
  hostName: string | null
  title: string | null
}

export default function CaptureMeta({ hostName, title }: CaptureMetaProps) {
  return (
    <div className="border-gray-2 border-y py-5 text-center">
      <div className="font-bold">{title}</div>
      <div className="text-gray-4">{hostName}</div>
    </div>
  )
}
