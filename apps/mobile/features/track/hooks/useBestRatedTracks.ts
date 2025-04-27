import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import api from "@/common/services/api";
import Track from "@/features/track/classes/Track";
import {useInfiniteQuery} from "@tanstack/react-query";
import _ from "lodash";
import {convertObjectToQueryParams} from "@/common/services/utilities";
import {AdditionalRankedListParams} from "@/features/track/types";

export const fetchBestRatedTracks = async (cursor: string | null, data: AdditionalRankedListParams) => await buildPaginatedQuery<Track>(api, {
    url: `/track/best-rated${convertObjectToQueryParams(data)}`,
    class: Track,
    entityKey: 'tracks',
    cursor: cursor
})

const useBestRatedTracks = (data: AdditionalRankedListParams) => useInfiniteQuery({
    queryFn: ({ pageParam = null }) => fetchBestRatedTracks(pageParam, data),
    getNextPageParam: lastPage => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null,
    queryKey: ['tracks', 'best-rated', data],
})

export default useBestRatedTracks