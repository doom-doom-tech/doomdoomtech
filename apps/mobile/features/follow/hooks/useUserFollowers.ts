import {useInfiniteQuery} from "@tanstack/react-query";
import {UserIDRequest} from "@/features/user/types/requests";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import api from "@/common/services/api";
import User from "@/features/user/classes/User";
import _ from "lodash";

const fetchUserFollowers = async (data: UserIDRequest, cursor: string | null) => await buildPaginatedQuery<User>(api, {
    url: `/user/${data.userID}/followers`,
    entityKey: 'followers',
    class: User,
    cursor: cursor
})

const useUserFollowers = (data: UserIDRequest) => useInfiniteQuery({
    queryKey: ['users', data.userID, 'followers'],
    queryFn: ({ pageParam = null }) => fetchUserFollowers(data, pageParam),
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null
})

export default useUserFollowers