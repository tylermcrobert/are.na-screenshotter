import { ARENA_API_URL } from "~constants"

type AuthProps = {
  setAccessToken: (token: string) => void
}

export default function Auth({ setAccessToken }: AuthProps) {
  const manifest = chrome.runtime.getManifest()
  const redirectUri = chrome.identity.getRedirectURL()
  const clientId: string = (manifest.oauth2 as any).client_id

  function openAuthWindow() {
    const oAuthUrl = `http://dev.are.na/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`
    const authOptions = { interactive: true, url: oAuthUrl }

    chrome.identity.launchWebAuthFlow(authOptions, async (redirectedUrl) => {
      const url = new URL(redirectedUrl as string)
      const code = url.searchParams.get("code") as string

      const authUrl = `${ARENA_API_URL}/oauth/token/?client_id=${clientId}&code=${code}&redirect_uri=${redirectUri}`

      fetch(authUrl, { method: "POST" })
        .then(async (res) => {
          const json = await res.json()

          if (!res.ok) {
            throw new Error("Error")
          }

          chrome.storage.local.set({ accessToken: json.access_token })
          setAccessToken(json.access_token)
        })
        .catch((err) => console.log(err.toString()))
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
