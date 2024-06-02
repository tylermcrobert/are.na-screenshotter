import { sendToBackground } from "@plasmohq/messaging"

import { ARENA_API_URL } from "~constants"

export class ApiReq {
  private accessToken: string

  constructor(token: string) {
    this.accessToken = token
  }

  private async corsRequest(
    url: string,
    method: "GET" | "POST",
    body?: object
  ) {
    const res = await sendToBackground({
      name: "corsRequest",
      body: {
        url: url,
        options: {
          body: JSON.stringify(body),
          method: method,
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        }
      }
    })

    if (res.error) {
      throw new Error(res.error)
    }

    return res.data
  }

  async searchChannels(q: string) {
    const url = `${ARENA_API_URL}/search/channels?q=${q}`
    return this.corsRequest(url, "GET")
  }

  async getChannels() {
    const url = `${ARENA_API_URL}/users/tyler-mcrobert/channels`
    return this.corsRequest(url, "GET")
  }

  async postScreenshot(
    channel: number,
    data: { screenshot: string; originUrl: string; originTitle: string }
  ) {
    const url = `${ARENA_API_URL}/channels/${channel}`
    return this.corsRequest(url, "POST", {
      screenshot: data.screenshot,
      originUrl: data.originUrl,
      originTitle: data.originTitle
    })
  }
}
