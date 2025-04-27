import {useInfiniteQuery} from "@tanstack/react-query";
import {FetchRankedTracksRequest} from "@/features/track/types/request";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import {UserIDRequest} from "@/features/user/types/requests";
import Track from "@/features/track/classes/Track";
import api from "@/common/services/api";
import _ from "lodash";

const fetchUserBestRatedTracks = async (data: FetchRankedTracksRequest & UserIDRequest, cursor?: string | null) => await buildPaginatedQuery<Track>(api, {
    entityKey: 'tracks',
    class: Track,
    url: `/user/${data.userID}/best-rated?period=${data.period}`,
    cursor: cursor
})

const useUserBestRatedTracks = (data:  FetchRankedTracksRequest & UserIDRequest) => useInfiniteQuery({
    queryKey: ['users', data.userID, 'tracks', 'best-rated'],
    queryFn: ({ pageParam = null }) => fetchUserBestRatedTracks(data, pageParam),
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null
})

export default useUserBestRatedTracks