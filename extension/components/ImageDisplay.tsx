type ImageDisplayProps = { image: string }

export default function ImageDisplay({ image }: ImageDisplayProps) {
  return (
    <div className="flex justify-center items-center bg-black p-3 aspect-square">
      {image && <img src={image} className="w-full" />}
    </div>
  )
}
