import {useInfiniteQuery} from "@tanstack/react-query";
import {FetchRankedTracksRequest} from "@/features/track/types/request";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import {UserIDRequest} from "@/features/user/types/requests";
import Track from "@/features/track/classes/Track";
import api from "@/common/services/api";
import _ from "lodash";

const fetchUserLatestReleases = async (data: FetchRankedTracksRequest & UserIDRequest, cursor?: string | null) => await buildPaginatedQuery<Track>(api, {
    entityKey: 'tracks',
    class: Track,
    url: `/user/${data.userID}/tracks?query=${data.query}`,
    cursor: cursor
})

const useUserTracks = (data: FetchRankedTracksRequest & UserIDRequest) => useInfiniteQuery({
    queryKey: ['users', data.userID, 'tracks', 'latest', data.query],
    queryFn: ({ pageParam = null }) => fetchUserLatestReleases(data, pageParam),
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null
})

export default useUserTracks