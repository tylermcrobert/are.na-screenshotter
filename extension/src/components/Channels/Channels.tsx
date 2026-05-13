import ChannelList from "../ChannelList"
import Spinner from "../Spinner"
import { useRecentChannels } from "./hooks/useRecentChannels"
import { useSearchChannels } from "./hooks/useSearchChannels"

export default function Channels() {
  const { recentChannels, initialLoading, loadMore } = useRecentChannels()
  const {
    //
    searchChannels,
    searchLoading,
    setSearchQuery,
    searchQuery,
    debouncedSearchQuery
  } = useSearchChannels()

  const showingSearchResults = debouncedSearchQuery.length > 0 && !searchLoading

  return (
    <div>
      <div className="relative mb-2">
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-center">
          {searchLoading ? <Spinner /> : null}
        </div>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          className="w-full rounded-sm border px-2 py-1 pr-8 placeholder:text-gray-4"
          placeholder="Search channels"
        />
      </div>

      <ChannelList
        onLoadMore={loadMore}
        hasMore={showingSearchResults ? false : recentChannels.hasMore}
        channels={showingSearchResults ? searchChannels : recentChannels.items}
        initialLoading={initialLoading}
      />
    </div>
  )
}
