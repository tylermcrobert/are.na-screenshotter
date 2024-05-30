import RefreshIcon from "./RefreshIcon"

type ImageDisplayProps = { image: string; refreshScreenshot: () => void }

export default function ImageDisplay({
  image,
  refreshScreenshot
}: ImageDisplayProps) {
  return (
    <div className="relative flex justify-center items-center bg-black mt-2 p-3 aspect-square group">
      <button
        className="group-hover:flex right-2 bottom-2 absolute justify-center items-center hidden bg-white rounded w-6 h-6"
        onClick={refreshScreenshot}>
        <RefreshIcon />
      </button>
      {image && <img src={image} className="w-full" />}
    </div>
  )
}
