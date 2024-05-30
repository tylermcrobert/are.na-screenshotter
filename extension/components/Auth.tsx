type AuthProps = {
  onAuth: (auth: string) => void
}

export default function Auth({ onAuth }: AuthProps) {
  function launchOAuthFlow() {
    const manifest = chrome.runtime.getManifest()
    const redirectUri = chrome.identity.getRedirectURL()

    const oAuthUrl = `http://dev.are.na/oauth/authorize?client_id=${manifest.oauth2.client_id}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`

    chrome.identity.launchWebAuthFlow(
      { interactive: true, url: oAuthUrl },
      (redirectedUrl) => {
        const url = new URL(redirectedUrl)
        const code = url.searchParams.get("code")

        chrome.storage.local.set({ auth: code }, () => {
          onAuth(code)
        })
      }
    )
  }

  return (
    <div className="flex flex-col justify-center items-center gap-2 p-2 w-full min-h-40">
      <button onClick={launchOAuthFlow} className="btn">
        Log in with Are.na →
      </button>
    </div>
  )
}
