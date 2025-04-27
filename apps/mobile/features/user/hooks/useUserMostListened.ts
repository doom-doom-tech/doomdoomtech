import {useInfiniteQuery} from "@tanstack/react-query";
import {FetchRankedTracksRequest} from "@/features/track/types/request";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import {UserIDRequest} from "@/features/user/types/requests";
import Track from "@/features/track/classes/Track";
import api from "@/common/services/api";
import _ from "lodash";

const fetchUserMostListenedTracks = async (data: FetchRankedTracksRequest & UserIDRequest, cursor?: string | null) => await buildPaginatedQuery<Track>(api, {
    entityKey: 'tracks',
    class: Track,
    url: `/user/${data.userID}/most-listened?period=${data.period}`,
    cursor: cursor
})

const useUserMostListened = (data:  FetchRankedTracksRequest & UserIDRequest) => useInfiniteQuery({
    queryKey: ['users', data.userID, 'tracks', 'most-listened'],
    queryFn: ({ pageParam = null }) => fetchUserMostListenedTracks(data, pageParam),
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null
})

export default useUserMostListened