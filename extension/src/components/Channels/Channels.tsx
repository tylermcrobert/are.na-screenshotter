import ChannelList from "../ChannelList"
import Spinner from "../Spinner"
import { useChannelSearch } from "./hooks/useChannelSearch"
import { useRecentChannels } from "./hooks/useRecentChannels"

export default function Channels() {
  const { recentChannels, initialLoading, loadMore } = useRecentChannels()
  const { search, searchResults, searchLoading, showSpinner, searchQuery } =
    useChannelSearch(recentChannels.items[0] ?? null)

  const isSearchActive = searchQuery.length > 0
  const listEmptyLoading = isSearchActive ? searchLoading : initialLoading

  return (
    <div>
      <div className="relative mb-2">
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-center">
          {showSpinner ? <Spinner /> : null}
        </div>
        <input
          value={searchQuery}
          onChange={(e) => search(e.target.value)}
          type="text"
          className="w-full rounded-sm border px-2 py-1 pr-8 placeholder:text-gray-4"
          placeholder="Search channels"
        />
      </div>

      <ChannelList
        onLoadMore={loadMore}
        hasMore={isSearchActive ? false : recentChannels.hasMore}
        channels={isSearchActive ? searchResults : recentChannels.items}
        loading={listEmptyLoading}
      />
    </div>
  )
}
