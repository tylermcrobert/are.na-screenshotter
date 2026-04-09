import { sendToBackground } from "@plasmohq/messaging"

import type { ArenaChannel } from "./types"

const ARENA_API_BASE_URL = "https://api.are.na/v3"
const SCREENSHOTTER_API_BASE = "http://localhost:5173/api"

export class Arena {
  private accessToken: string
  private userSlug: string

  constructor(token: string, userSlug: string) {
    this.accessToken = token
    this.userSlug = userSlug
  }

  private async fetch(url: string, method: "GET" | "POST", body?: object) {
    const res = await sendToBackground({
      name: "fetch",
      body: {
        url: url,
        options: {
          body: body ? JSON.stringify(body) : undefined,
          method: method,
          headers: {
            "Content-Type": "application/json",
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

  async searchUserChannels(q: string): Promise<ArenaChannel[]> {
    const url = `${ARENA_API_BASE_URL}/users/${this.userSlug}/contents?type=Channel&per=100&sort=updated_at_desc`
    const res = await this.fetch(url, "GET")
    const query = q.toLowerCase()

    return res.data.filter(
      (ch: ArenaChannel) =>
        ch.title.toLowerCase().includes(query) &&
        ch.owner.slug === this.userSlug
    )
  }

  async getUserChannels(): Promise<ArenaChannel[]> {
    const url = `${ARENA_API_BASE_URL}/users/${this.userSlug}/contents?type=Channel&per=5&sort=updated_at_desc`
    const res = await this.fetch(url, "GET")
    return res.data
  }

  async postScreenshot(
    channel: number,
    data: {
      screenshot: string
      originUrl: string
      originTitle: string
    }
  ) {
    const apiUrl = `${SCREENSHOTTER_API_BASE}/are.na/channels/${channel}/blocks`
    const res = await this.fetch(apiUrl, "POST", {
      asset: data.screenshot,
      title: data.originTitle,
      url: data.originUrl
    })

    return res
  }
}
