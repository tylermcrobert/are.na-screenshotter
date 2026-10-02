import {
  createArena,
  type Arena as ArenaType,
  type Block,
  type Channel
} from "@aredotna/sdk"

const DATA_URL_MIME = /^data:([^;,]+)/

function isChannel(row: { type: string }): row is Channel {
  return row.type === "Channel"
}

function byUpdatedAtDesc(a: Channel, b: Channel) {
  return Date.parse(b.updated_at) - Date.parse(a.updated_at)
}

export class ArenaScreenshotterClient {
  private userSlug: string
  private client: ArenaType
  private allChannels: Channel[] = []

  constructor(token: string, userSlug: string) {
    this.client = createArena({ token: token })
    this.userSlug = userSlug
  }

  /**
   * Gets all of the user's channels
   */
  async getAllChannels(): Promise<Channel[]> {
    if (this.allChannels.length) return this.allChannels

    const first = await this.getChannelsPage(1, 100)
    const rest = await Promise.all(
      Array.from({ length: Math.max(first.meta.total_pages - 1, 0) }, (_, i) =>
        this.getChannelsPage(i + 2, 100)
      )
    )

    this.allChannels = [first, ...rest].flatMap((res) => res.data)
    return this.allChannels
  }

  /**
   * Gets the user's most recently updated channels
   */
  async getRecentChannels(per = 20): Promise<Channel[]> {
    const res = await this.getChannelsPage(1, per)
    return res.data
  }

  /**
   * @note The API selects the right page for `updated_at_desc` but returns its items
   * oldest first, so each page is re-sorted here.
   */
  private async getChannelsPage(page: number, per: number) {
    const res = await this.client.users.contents(this.userSlug, {
      type: "Channel",
      per,
      sort: "updated_at_desc",
      page
    })

    return { ...res, data: res.data.filter(isChannel).sort(byUpdatedAtDesc) }
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
    const mimeType =
      blob.type || data.screenshot.match(DATA_URL_MIME)?.[1] || "image/png"
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
