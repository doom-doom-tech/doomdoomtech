import {useInfiniteQuery} from "@tanstack/react-query";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import Track from "@/features/track/classes/Track";
import api from "@/common/services/api";
import _ from "lodash";
import {convertObjectToQueryParams} from "@/common/services/utilities";
import {AdditionalRankedListParams} from "@/features/track/types";

const fetchUserMostListenedTracks = async (cursor: string | null, data: AdditionalRankedListParams) => await buildPaginatedQuery<Track>(api, {
    entityKey: 'tracks',
    class: Track,
    url: `/track/most-listened${convertObjectToQueryParams(data)}`,
    cursor: cursor
})

const useMostListenedTracks = (data: AdditionalRankedListParams) => useInfiniteQuery({
    queryKey: ['tracks', 'most-listened', data],
    queryFn: ({ pageParam = null }) => fetchUserMostListenedTracks(pageParam, data),
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null
})

export default useMostListenedTracks