import { AUTH_URL } from "~constants"

export default function Auth() {
  return (
    <div className="flex flex-col justify-center items-center gap-2 p-2 w-full min-h-40">
      <a
        href={AUTH_URL.toString()}
        target="_blank"
        className="text-center underline">
        Authorize Are.na
      </a>
    </div>
  )
}
