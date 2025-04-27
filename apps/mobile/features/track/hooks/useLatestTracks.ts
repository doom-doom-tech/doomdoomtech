import {AdditionalRankedListParams} from "@/features/track/types";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import Track from "@/features/track/classes/Track";
import api from "@/common/services/api";
import {convertObjectToQueryParams} from "@/common/services/utilities";
import {useInfiniteQuery} from "@tanstack/react-query";
import _ from "lodash";

const fetchLatestTracks = async (cursor: string | null, data: AdditionalRankedListParams) => await buildPaginatedQuery<Track>(api, {
    entityKey: 'tracks',
    class: Track,
    url: `/track/latest${convertObjectToQueryParams(data)}`,
    cursor: cursor
})

const useLatestTracks = (data: AdditionalRankedListParams) => useInfiniteQuery({
    queryKey: ['tracks', 'latest', data],
    queryFn: ({ pageParam = null }) => fetchLatestTracks(pageParam, data),
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null
})

export default useLatestTracks