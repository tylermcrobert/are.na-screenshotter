import { sendToBackground } from "@plasmohq/messaging"

import { ARENA_API_URL } from "~constants"

export class ApiReq {
  private accessToken: string

  constructor(token: string) {
    this.accessToken = token
  }

  private async corsRequest(url: string, method: "GET" | "POST") {
    return sendToBackground({
      name: "corsRequest",
      body: {
        url: url,
        options: {
          method: method,
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        }
      }
    })
  }

  async searchChannels(q: string) {
    const url = `${ARENA_API_URL}/search/channels?q=${q}`
    return this.corsRequest(url, "GET")
  }

  async getChannels() {
    const url = `${ARENA_API_URL}/users/tyler-mcrobert/channels`
    return this.corsRequest(url, "GET")
  }

  async postScreenshot() {
    // Implement postScreenshot functionality here
  }
}
