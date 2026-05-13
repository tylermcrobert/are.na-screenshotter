import { createArena, type Arena as ArenaType, type Channel } from "@aredotna/sdk/dist/index.js"

type RequestOverrides = NonNullable<Parameters<ArenaType["users"]["contents"]>[2]>
type UserContentsResponse = Awaited<ReturnType<ArenaType["users"]["contents"]>>
export type UserChannelsListResponse = Omit<UserContentsResponse, "data"> & { data: Channel[] }

function isChannel(row: { type: string }): row is Channel {
  return row.type === "Channel"
}

export class ArenaScreenshotterClient {
  private userSlug: string
  private client: ArenaType

  constructor(token: string, userSlug: string) {
    this.client = createArena({ token: token })
    this.userSlug = userSlug
  }

  /**
   * Searches for channels
   * @param q - The query to search for
   * @returns The channels that match the query
 
  // TODO: Implement pagination
  // TODO: Get all channels not just the first 100
 
  */
  async searchUserChannels(q: string, options?: RequestOverrides): Promise<Channel[]> {
    const res = await this.client.users.contents(
      this.userSlug,
      { type: "Channel", per: 100, sort: "updated_at_desc" },
      options
    )

    const channels = res.data.filter(isChannel)
    const needle = q.trim().toLowerCase()
    if (!needle.length) return channels

    return channels.filter(
      (ch) => ch.title.toLowerCase().includes(needle) || ch.slug.toLowerCase().includes(needle)
    )
  }

  /**
   * Gets the user's channels
   */
  async getUserChannels(options?: RequestOverrides): Promise<UserChannelsListResponse> {
    const res = await this.client.users.contents(
      this.userSlug,
      { type: "Channel", per: 20, sort: "updated_at_desc" },
      options
    )

    return { ...res, data: [...res.data.filter(isChannel)].reverse() }
  }

  async postScreenshot(
    channel: number,
    data: {
      screenshot: string
      originUrl: string
      originTitle: string
    }
  ) {
    // const apiUrl = `${SCREENSHOTTER_API_BASE}/are.na/channels/${channel}/blocks`
    // const res = await this.fetch(apiUrl, "POST", {
    //   asset: data.screenshot,
    //   title: data.originTitle,
    //   url: data.originUrl
    // })
    // return res
  }
}
