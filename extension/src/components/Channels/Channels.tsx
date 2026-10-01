import ChannelList from "../ChannelList"
import Spinner from "../Spinner"
import { useChannelSearch } from "./hooks/useChannelSearch"
import { useRecentChannels } from "./hooks/useRecentChannels"

export default function Channels() {
  const { recentChannels, initialLoading, loadMore } = useRecentChannels()
  const {
    fetchAllChannels,
    search,
    searchResults,
    searchLoading,
    showSpinner,
    searchQuery,
    debouncedSearchQuery
  } = useChannelSearch()

  const isSearchActive = debouncedSearchQuery.length > 0
  const showingSearchResults = isSearchActive && !searchLoading
  const listEmptyLoading = isSearchActive ? searchLoading : initialLoading

  return (
    <div>
      <div className="relative mb-2">
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-center">
          {showSpinner ? <Spinner /> : null}
        </div>
        <input
          onFocus={fetchAllChannels}
          value={searchQuery}
          onChange={(e) => search(e.target.value)}
          type="text"
          className="w-full rounded-sm border px-2 py-1 pr-8 placeholder:text-gray-4"
          placeholder="Search channels"
        />
      </div>

      <ChannelList
        onLoadMore={loadMore}
        hasMore={showingSearchResults ? false : recentChannels.hasMore}
        channels={showingSearchResults ? searchResults : recentChannels.items}
        loading={listEmptyLoading}
      />
    </div>
  )
}
