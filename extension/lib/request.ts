import type Arena from "are.na"

import { sendToBackground } from "@plasmohq/messaging"

import { ARENA_API_URL } from "~constants"

const ARENA_API_BASE_URL = "https://api.are.na/v2"

export class ApiReq {
  private accessToken: string
  private userSlug: string

  constructor(token: string, userSlug: string) {
    this.accessToken = token
    this.userSlug = userSlug
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

  async searchUserChannels(q: string): Promise<Arena.Channel[]> {
    const url = `${ARENA_API_BASE_URL}/search/channels?q=${q}&user=${this.userSlug}&per=5`

    const res = await this.corsRequest(url, "GET")
    const filteredChannels = res.channels.filter(
      (a: Arena.Channel) => a.user.slug === this.userSlug
    )

    return filteredChannels
  }

  async getUserChannels() {
    const url = `${ARENA_API_BASE_URL}/users/${this.userSlug}/channels?per=5`
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
