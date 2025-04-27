import {useInfiniteQuery} from "@tanstack/react-query";
import _ from "lodash";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import api from "@/common/services/api";
import User from "@/features/user/classes/User";

const searchUsers = async (query: string, cursor: string | null) => await buildPaginatedQuery<User>(api, {
	cursor: cursor,
	url: `/user/search?query=${query}`,
	entityKey: 'users',
	class: User
})

const useSearchUsers = (query: string) => useInfiniteQuery({
	queryKey: ['search', 'users', query],
	initialPageParam: <string | null>null,
	queryFn: ({ pageParam = null }) => searchUsers(query, pageParam),
	getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null)
})

export default useSearchUsers