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
type UserContentsOptions = NonNullable<Parameters<ArenaType["users"]["contents"]>[1]>

function isChannel(row: { type: string }): row is Channel {
  return row.type === "Channel"
}

export class ArenaScreenshotterClient {
  private userSlug: string
  private client: ArenaType
  private allChannels: Channel[] = []

  constructor(token: string, userSlug: string) {
    this.client = createArena({ token: token })
    this.userSlug = userSlug
    this.allChannels = []
  }

  /**
   * Gets all of the user's channels
   * @param options - The options for the request
   * @returns The channels
   */

  async getAllChannels(options?: RequestOverrides): Promise<Channel[]> {
    if (this.allChannels.length) return this.allChannels

    const getPage = (page: number) => {
      const PAGE_SIZE = 100
      return this.client.users.contents(
        this.userSlug,
        { type: "Channel", per: PAGE_SIZE, sort: "updated_at_desc", page },
        options
      )
    }

    const initialResponse = await getPage(1)
    const totalPages = initialResponse.meta.total_pages
    const initialItems = initialResponse.data.filter(isChannel)
    const remainingPages = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) => i + 2).map((page) => getPage(page))
    ).then((res) => res.flatMap((r) => r.data.filter(isChannel)))

    return [...initialItems, ...remainingPages]
  }

  /**
   * Gets the user's recent channels
   */
  async getRecentChannels(
    options: UserContentsOptions & { per: number },
    overrides?: RequestOverrides
  ): Promise<UserChannelsListResponse> {
    const res = await this.client.users.contents(
      this.userSlug,
      {
        type: "Channel",
        sort: "updated_at_desc",
        page: options.page,
        ...options
      },
      overrides
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
