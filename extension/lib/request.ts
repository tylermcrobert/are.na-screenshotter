import type Arena from "are.na"

import { sendToBackground } from "@plasmohq/messaging"

import { ARENA_API_URL } from "~constants"

const ARENA_API_BASE_URL = "https://api.are.na/v2"

/**
 * Represents an API request object.
 */
export class ApiReq {
  private accessToken: string
  private userSlug: string

  /**
   * Constructs a new ApiReq object.
   * @param token - The access token for the API.
   * @param userSlug - The user slug for the API.
   */
  constructor(token: string, userSlug: string) {
    this.accessToken = token
    this.userSlug = userSlug
  }

  /**
   * Sends a CORS request to the API.
   * @param url - The URL for the request.
   * @param method - The HTTP method for the request.
   * @param body - The request body (optional).
   * @returns A Promise that resolves to the response data.
   * @throws An error if the request fails.
   */
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

  /**
   * Searches for user channels based on a query.
   * @param q - The search query.
   * @returns A Promise that resolves to an array of user channels.
   */
  async searchUserChannels(q: string): Promise<Arena.Channel[]> {
    const url = `${ARENA_API_BASE_URL}/search/channels?q=${q}&user=${this.userSlug}&per=5`

    const res = await this.corsRequest(url, "GET")
    const filteredChannels = res.channels.filter(
      (a: Arena.Channel) => a.user.slug === this.userSlug
    )

    return filteredChannels
  }

  /**
   * Retrieves the user's channels.
   * @returns A Promise that resolves to an array of user channels.
   */
  async getUserChannels(): Promise<Arena.Channel[]> {
    const url = `${ARENA_API_BASE_URL}/users/${this.userSlug}/channels?per=5`
    const res = await this.corsRequest(url, "GET")
    return res.channels
  }

  /**
   * Posts a screenshot to a channel.
   * @param channel - The channel ID.
   * @param data - The screenshot data.
   * @returns A Promise that resolves to the response data.
   */
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
