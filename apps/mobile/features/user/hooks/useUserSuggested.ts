import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import api from "@/common/services/api";
import {useInfiniteQuery} from "@tanstack/react-query";
import _ from "lodash";
import User from "@/features/user/classes/User";

const fetchSuggestedUsers = async (cursor?: string | null) => await buildPaginatedQuery<User>(api, {
    entityKey: 'users',
    class: User,
    url: `/user/suggested`,
    cursor: cursor
})

const useUserSuggested = () => useInfiniteQuery({
    queryKey: ['users', 'suggested'],
    queryFn: ({ pageParam = null }) => fetchSuggestedUsers(pageParam),
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null
})

export default useUserSuggested;