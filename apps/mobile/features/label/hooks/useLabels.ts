import {useInfiniteQuery} from "@tanstack/react-query";
import api from "@/common/services/api";
import _ from "lodash";
import User from "@/features/user/classes/User";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";

const fetchLabels = async (cursor: string | null) => await buildPaginatedQuery<User>(api, {
    class: User,
    url: '/user/labels',
    entityKey: 'labels',
    cursor: cursor
})

const useLabels = () => useInfiniteQuery({
    queryFn: ({ pageParam = null }) => fetchLabels(pageParam),
    queryKey: ['users', 'labels'],
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null
})

export default useLabels