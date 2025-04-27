import {useInfiniteQuery} from "@tanstack/react-query";
import {FetchEntityComments} from "@/features/comment/types/requests";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import Comment from "@/features/comment/classes/Comment"
import api from "@/common/services/api";
import _ from "lodash";

const fetchEntityComments = async (data: FetchEntityComments, cursor: string | null) => await buildPaginatedQuery<Comment>(api, {
    url: `/comments/${data.entity}/${data.entityID}`,
    entityKey: 'comments',
    class: Comment,
    cursor
})

const useEntityComments = (data: FetchEntityComments) => useInfiniteQuery({
    queryFn: ({ pageParam = null }) => fetchEntityComments(data, pageParam),
    queryKey: ['comments', data.entity, data.entityID],
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null
})

export default useEntityComments