import {UserIDRequest} from "@/features/user/types/requests";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import api from "@/common/services/api";
import {useInfiniteQuery} from "@tanstack/react-query";
import _ from "lodash";
import Album from "@/features/album/classes/Album";

const fetchUserAlbums = async (data: UserIDRequest, cursor?: string | null) => await buildPaginatedQuery<Album>(api, {
    entityKey: 'albums',
    class: Album,
    url: `/user/${data.userID}/albums`,
    cursor: cursor
})

const useUserAlbums = (data: UserIDRequest) => useInfiniteQuery({
    queryKey: ['users', data.userID, 'albums'],
    queryFn: ({ pageParam = null }) => fetchUserAlbums(data, pageParam),
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null
})

export default useUserAlbums