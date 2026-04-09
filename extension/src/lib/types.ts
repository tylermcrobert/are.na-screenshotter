export type ArenaChannel = {
  id: number
  type: "Channel"
  slug: string
  title: string
  visibility: "public" | "closed" | "private"
  counts: {
    blocks: number
    channels: number
    contents: number
    collaborators: number
  }
  owner: {
    id: number
    type: string
    name: string
    slug: string
  }
}
