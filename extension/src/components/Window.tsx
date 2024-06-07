type WindowProps = {
  children: React.ReactNode
  closeWindow: () => void
}

export default function Window({ children, closeWindow }: WindowProps) {
  return (
    <>
      <div className="z-10 fixed inset-0 bg-black/15" onClick={closeWindow} />
      <div className="top-4 right-4 z-20 fixed bg-white rounded-md w-full max-w-[280px] h-[calc(100dvh-(theme(space.4)*2))] max-h-[480px] overflow-hidden">
        {children}
      </div>
    </>
  )
}
