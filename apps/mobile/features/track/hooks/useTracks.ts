import {useInfiniteQuery} from "@tanstack/react-query";
import _ from "lodash";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import Track from "@/features/track/classes/Track";
import api from "@/common/services/api";

interface FetchTracksRequest {
    query: string
}

const fetchTracks = async (cursor: string | null, data: FetchTracksRequest) => await buildPaginatedQuery<Track>(api, {
    url: `/track?query=${data.query}`,
    class: Track,
    entityKey: 'tracks',
    cursor: cursor
})

const useTracks = (data: FetchTracksRequest) => useInfiniteQuery({
    queryFn: ({ pageParam = null }) => fetchTracks(pageParam, data),
    queryKey: ['tracks', data.query],
    getNextPageParam: lastPage => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null,
})

export default useTracks