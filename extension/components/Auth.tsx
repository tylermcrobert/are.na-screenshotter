import { ARENA_API_URL } from "~constants"

type AuthProps = {
  setAccessToken: (token: string) => void
}

export default function Auth({ setAccessToken }: AuthProps) {
  function launchOAuthFlow() {
    const manifest = chrome.runtime.getManifest()
    const redirectUri = chrome.identity.getRedirectURL()
    const clientId: string = (manifest.oauth2 as any).client_id

    const oAuthUrl = `http://dev.are.na/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`

    /**
     * Handles the redirect from Are.na
     */
    function handleRedirect(redirectedUrl: string | undefined) {
      const url = new URL(redirectedUrl as string)
      const authToken = url.searchParams.get("code")
      fetchAccessToken(authToken)
    }

    /**
     * Handles the OAuth flow
     */
    async function fetchAccessToken(code: string | null) {
      const authUrl = `${ARENA_API_URL}/oauth/token/?client_id=${clientId}&code=${code}&redirect_uri=${redirectUri}`

      const tokenResponse = await fetch(authUrl, { method: "POST" })
      const tokenJson = await tokenResponse.json()

      if (!tokenResponse.ok) {
        throw new Error(tokenJson.error || "An unexpected error occurred.")
      }

      chrome.storage.local.set({ accessToken: tokenJson.access_token })
      setAccessToken(tokenJson.access_token)
    }

    const authOptions = { interactive: true, url: oAuthUrl }
    chrome.identity.launchWebAuthFlow(authOptions, handleRedirect)
  }

  return (
    <div className="flex flex-col justify-center items-center gap-2 p-2 w-full min-h-40">
      <button onClick={launchOAuthFlow} className="btn">
        Log in with Are.na →
      </button>
    </div>
  )
}
