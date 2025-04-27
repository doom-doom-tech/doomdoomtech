import {useInfiniteQuery} from "@tanstack/react-query";
import {AdditionalRankedListParams} from "@/features/track/types";
import _ from "lodash";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import api from "@/common/services/api";
import {convertObjectToQueryParams} from "@/common/services/utilities";
import User from "@/features/user/classes/User";

const fetchLatestArtists = async (cursor: string | null, data: AdditionalRankedListParams) => await buildPaginatedQuery<User>(api, {
    url: `/user/latest${convertObjectToQueryParams(data)}`,
    class: User,
    entityKey: 'users',
    cursor: cursor
})

const useUserLatest = (data: AdditionalRankedListParams) => useInfiniteQuery({
    queryFn: ({ pageParam = null }) => fetchLatestArtists(pageParam, data),
    getNextPageParam: lastPage => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null,
    queryKey: ['users', 'latest', data],
})

export default useUserLatest