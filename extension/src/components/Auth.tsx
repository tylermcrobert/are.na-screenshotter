type AuthProps = {
  authenticate: () => void
}

export default function Auth({ authenticate }: AuthProps) {
  return (
    <div className="flex h-dvh items-center justify-center">
      <button onClick={authenticate} className="btn">
        Log in with Are.na →
      </button>
    </div>
  )
}
