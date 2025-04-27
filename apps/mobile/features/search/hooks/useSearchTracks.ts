import {useInfiniteQuery} from "@tanstack/react-query";
import _ from "lodash";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import Track from "@/features/track/classes/Track";
import api from "@/common/services/api";

const searchTracks = async (query: string, cursor: string | null) => await buildPaginatedQuery<Track>(api, {
	cursor: cursor,
	url: `/track/search?query=${query}`,
	entityKey: 'tracks',
	class: Track
})

const useSearchTracks = (query: string) => useInfiniteQuery({
	queryKey: ['search', 'tracks', query],
	initialPageParam: <string | null>null,
	queryFn: ({ pageParam = null }) => searchTracks(query, pageParam),
	getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null)
})

export default useSearchTracks