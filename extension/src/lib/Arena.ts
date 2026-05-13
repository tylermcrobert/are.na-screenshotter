import {
  createArena,
  type Arena as ArenaType,
  type Block,
  type Channel
} from "@aredotna/sdk/dist/index.js"

const DATA_URL_MIME = /^data:([^;,]+)/

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
    channelId: number,
    data: {
      screenshot: string
      originUrl: string
      originTitle: string
    }
  ): Promise<Block> {
    const res = await fetch(data.screenshot)
    const blob = await res.blob()
    const mimeType = blob.type || data.screenshot.match(DATA_URL_MIME)?.[1] || "image/png"
    const extension = mimeType.split("/")[1] || "png"
    const buffer = await blob.arrayBuffer()

    return this.client.uploads.createBlock({
      file: {
        data: new Uint8Array(buffer),
        contentType: mimeType,
        filename: `screenshot.${extension}`
      },
      channels: [{ id: channelId }],
      block: {
        title: data.originTitle,
        original_source_url: data.originUrl,
        original_source_title: data.originTitle
      }
    })
  }
}
