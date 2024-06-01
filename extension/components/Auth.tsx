import { ARENA_API_URL } from "~constants"

type AuthProps = {
  onAuth: (auth: string) => void
}

export default function Auth({ onAuth }: AuthProps) {
  function launchOAuthFlow() {
    const manifest = chrome.runtime.getManifest()
    const redirectUri = chrome.identity.getRedirectURL()
    const clientId: string = (manifest.oauth2 as any).client_id

    const oAuthUrl = `http://dev.are.na/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`

    /**
     * Handles the redirect from Are.na
     */
    function handleRedirect(redirectedUrl: string | undefined) {
      if (!redirectedUrl) {
        throw new Error("No redirected URL")
      }

      const url = new URL(redirectedUrl)
      const code = url.searchParams.get("code")

      async function onLocalSet() {
        const authUrl = `${ARENA_API_URL}/oauth/token/?client_id=${clientId}&code=${code}&redirect_uri=${redirectUri}`

        const tokenResponse = await fetch(authUrl, { method: "POST" })
        const tokenJson = await tokenResponse.json()

        if (!tokenResponse.ok) {
          console.log(tokenJson)
          throw new Error(tokenJson.error || "An unexpected error occurred.")
        }

        console.log("Auth token set", tokenJson.access_token)
      }

      chrome.storage.local.set({ auth: code }, onLocalSet)
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
