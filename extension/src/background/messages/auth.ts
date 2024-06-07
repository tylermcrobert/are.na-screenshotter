import type { PlasmoMessaging } from "@plasmohq/messaging"

export const SCREENSHOTTER_API_BASE =
  "https://are-na-screenshotter-git-main-tyler-mcrobert.vercel.app/api"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("auth handler")

  const manifest = chrome.runtime.getManifest()
  const clientId: string = (manifest.oauth2 as any).client_id
  const redirectUri = chrome.identity.getRedirectURL()

  try {
    const redirectUrl = await new Promise<string>((resolve, reject) => {
      chrome.identity.launchWebAuthFlow(
        {
          url: `http://dev.are.na/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`,
          interactive: true
        },
        resolve
      )
    })

    const url = new URL(redirectUrl as string)
    const code = url.searchParams.get("code")

    if (!code) {
      throw new Error("No code found in redirect URL")
    }

    const tokenUrl = `${SCREENSHOTTER_API_BASE}/are.na/oauth/token/?client_id=${clientId}&code=${code}&redirect_uri=${redirectUri}`

    const tokenResponse = await fetch(tokenUrl, { method: "POST" })
    const tokenJson = await tokenResponse.json()

    if (!tokenResponse.ok) {
      const errorMessage = `Error fetching access token: "${tokenJson.error_description}"`
      throw new Error(errorMessage)
    }

    const payload = {
      accessToken: tokenJson.access_token,
      userSlug: tokenJson.user
    }

    chrome.storage.local.set(payload)

    res.send(payload)
  } catch (error) {
    console.log(error)
  }
}

export default handler
