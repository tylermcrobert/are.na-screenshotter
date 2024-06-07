type AuthProps = {
  authenticate: () => void
}

export default function Auth({ authenticate }: AuthProps) {
  return (
    <div className="">
      <button onClick={authenticate} className="btn">
        Log in with Are.na →
      </button>
    </div>
  )
}
