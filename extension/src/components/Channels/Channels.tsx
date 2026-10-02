import Spinner from "~components/Spinner"

import ChannelList from "./ChannelList"
import { useChannelSearch } from "./useChannelSearch"

export default function Channels() {
  const { search, searchResults, searchLoading, showSpinner, searchQuery } =
    useChannelSearch()

  return (
    <div>
      <div className="relative mb-2">
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-center">
          {showSpinner ? <Spinner /> : null}
        </div>
        <input
          autoFocus
          value={searchQuery}
          onChange={(e) => search(e.target.value)}
          type="text"
          className="w-full rounded-sm border px-2 py-1 pr-8 placeholder:text-gray-4"
          placeholder="Search channels"
        />
      </div>

      <ChannelList
        key={searchQuery}
        channels={searchResults}
        loading={searchLoading}
      />
    </div>
  )
}
