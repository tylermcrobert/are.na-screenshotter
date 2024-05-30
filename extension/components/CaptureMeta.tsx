type CaptureMetaProps = {
  url: string
  title: string
}

export default function CaptureMeta({ url, title }: CaptureMetaProps) {
  return (
    <div className="border-gray-2 border-y py-5 text-center">
      <div className="font-bold">{title}</div>
      <div className="text-gray-4">
        {url ? new URL(url).hostname.toString() : null}
      </div>
    </div>
  )
}
