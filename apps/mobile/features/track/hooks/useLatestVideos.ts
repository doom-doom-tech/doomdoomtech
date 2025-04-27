import {AdditionalRankedListParams} from "@/features/track/types";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import Track from "@/features/track/classes/Track";
import api from "@/common/services/api";
import {convertObjectToQueryParams} from "@/common/services/utilities";
import {useInfiniteQuery} from "@tanstack/react-query";
import _ from "lodash";

const fetchLatestVideos = async (cursor: string | null, data: AdditionalRankedListParams) => await buildPaginatedQuery<Track>(api, {
    entityKey: 'tracks',
    class: Track,
    url: `/track/latest-videos${convertObjectToQueryParams(data)}`,
    cursor: cursor
})

const useLatestVideos = (data: AdditionalRankedListParams) => useInfiniteQuery({
    queryKey: ['tracks', 'latest-videos', data],
    queryFn: ({ pageParam = null }) => fetchLatestVideos(pageParam, data),
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null
})

export default useLatestVideos