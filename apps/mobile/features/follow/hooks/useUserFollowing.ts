import {useInfiniteQuery} from "@tanstack/react-query";
import {UserIDRequest} from "@/features/user/types/requests";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import api from "@/common/services/api";
import User from "@/features/user/classes/User";
import _ from "lodash";

const fetchUserFollowing = async (data: UserIDRequest, cursor: string | null) => await buildPaginatedQuery<User>(api, {
    url: `/user/${data.userID}/following`,
    entityKey: 'followees',
    class: User,
    cursor: cursor
})

const useUserFollowing = (data: UserIDRequest) => useInfiniteQuery({
    queryKey: ['users', data.userID, 'following'],
    queryFn: ({ pageParam = null }) => fetchUserFollowing(data, pageParam),
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null
})

export default useUserFollowing