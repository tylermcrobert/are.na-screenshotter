type WindowProps = {
  children: React.ReactNode
  closeWindow: () => void
}

export default function Window({ children, closeWindow }: WindowProps) {
  return (
    <>
      <div className="fixed inset-0 z-10 bg-black/15" onClick={closeWindow} />
      <div className="fixed top-4 right-4 z-20 h-[calc(100dvh-(theme(space.4)*2))] max-h-[480px] w-full max-w-[280px] overflow-hidden rounded-md bg-white">
        {children}
      </div>
    </>
  )
}
