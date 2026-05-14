import type { PlasmoMessaging } from "@plasmohq/messaging"

const SCREENSHOTTER_API_BASE = process.env.PLASMO_PUBLIC_API_BASE

export type AuthResponse =
  | { ok: true; accessToken: string; userSlug: string }
  | { ok: false; message: string }

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const manifest = chrome.runtime.getManifest()
  const clientId: string = (manifest.oauth2 as any).client_id
  const redirectUri = chrome.identity.getRedirectURL()

  if (!SCREENSHOTTER_API_BASE) {
    res.send({
      ok: false,
      message: "Missing API base URL."
    } satisfies AuthResponse)
    return
  }

  try {
    const redirectUrl = await new Promise<string>((resolve, reject) => {
      chrome.identity.launchWebAuthFlow(
        {
          url: `https://www.are.na/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=write`,
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
      ok: true,
      accessToken: tokenJson.access_token,
      userSlug: tokenJson.user
    } satisfies AuthResponse

    chrome.storage.local.set({
      accessToken: payload.accessToken,
      userSlug: payload.userSlug
    })

    res.send(payload)
  } catch (error) {
    console.log(error)
    res.send({
      ok: false,
      message: error instanceof Error ? error.message : "Authentication failed."
    } satisfies AuthResponse)
  }
}

export default handler
