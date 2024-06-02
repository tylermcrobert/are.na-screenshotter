import { ARENA_API_URL } from "~constants"

type AuthProps = {
  setAccessToken: (token: string) => void
  setUserSlug: (userSlug: string) => void
  setError: (token: string | null) => void
}

export default function Auth({
  setAccessToken,
  setError,
  setUserSlug
}: AuthProps) {
  const manifest = chrome.runtime.getManifest()
  const redirectUri = chrome.identity.getRedirectURL()
  const clientId: string = (manifest.oauth2 as any).client_id

  async function openAuthWindow() {
    setError(null)

    const oAuthUrl = `http://dev.are.na/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`
    const authOptions = { interactive: true, url: oAuthUrl }

    chrome.identity.launchWebAuthFlow(authOptions, async (redirectedUrl) => {
      const url = new URL(redirectedUrl as string)
      const code = url.searchParams.get("code") as string

      const authUrl = `${ARENA_API_URL}/oauth/token/?client_id=${clientId}&code=${code}&redirect_uri=${redirectUri}`

      try {
        const res = await fetch(authUrl, { method: "POST" })
        const json = await res.json()

        if (!res.ok) {
          const errorMessage = `Error fetching access token: "${json.error_description}"`
          throw new Error(errorMessage)
        }

        chrome.storage.local.set({
          accessToken: json.access_token,
          userSlug: json.user
        })

        setAccessToken(json.access_token)
        setUserSlug(json.user)
      } catch (e: any) {
        setError(e.message)
      }
    })
  }

  return (
    <div className="flex flex-col justify-center items-center gap-2 p-2 w-full min-h-40">
      <button onClick={openAuthWindow} className="btn">
        Log in with Are.na →
      </button>
    </div>
  )
}
