import { sendToBackground } from "@plasmohq/messaging"

import type { AuthResponse } from "~background/messages/auth"

type AuthProps = {
  onSuccess: (accessToken: string, userSlug: string) => void
  onError: (error: string) => void
}

export default function Auth({ onSuccess, onError }: AuthProps) {
  async function authenticate() {
    try {
      const response = await sendToBackground<AuthResponse>({ name: "auth" })
      if (!response.ok) {
        onError(response.message)
        return
      }
      onSuccess(response.accessToken, response.userSlug)
    } catch (err) {
      console.error(err)
      onError("Error authenticating")
    }
  }

  return (
    <div className="flex h-dvh items-center justify-center">
      <button onClick={authenticate} className="btn">
        Log in with Are.na →
      </button>
    </div>
  )
}
