import {useInfiniteQuery} from "@tanstack/react-query";
import api from "@/common/services/api";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import User from "@/features/user/classes/User";
import _ from "lodash";

const getUserVisitors = async (cursor: string | null) => await buildPaginatedQuery<User>(api, {
    url: `/user/visitors`,
    class: User,
    entityKey: 'visitors',
    cursor: cursor
})

const useUserVisitors = () => useInfiniteQuery({
    queryKey: ['user', 'visitors'],
    queryFn: ({ pageParam = null }) => getUserVisitors(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
})

export default useUserVisitors