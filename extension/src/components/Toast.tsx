type ToastProps = {
  onClose: () => void
  error: string | null
}

export default function Toast({ onClose, error }: ToastProps) {
  return (
    <div
      className={[
        "fixed inset-x-2 top-2 z-50",
        "flex gap-2 rounded-md border border-red-600 bg-red-500 py-1 text-white",
        "translate-y-0 opacity-100 transition-all duration-300 ease-out starting:translate-y-2 starting:opacity-0"
      ].join(" ")}>
      <span className="flex-1 px-2">{error}</span>
      <button
        type="button"
        onClick={onClose}
        className="mx-1 cursor-pointer rounded-md bg-red-600 px-2 py-1">
        Close
      </button>
    </div>
  )
}
