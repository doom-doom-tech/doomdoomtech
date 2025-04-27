import {useInfiniteQuery} from "@tanstack/react-query";
import {CommentIDRequest} from "@/features/comment/types/requests";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import Comment from "@/features/comment/classes/Comment"
import api from "@/common/services/api";
import _ from "lodash";

const fetchReplies = async (data: CommentIDRequest, cursor: string | null) => await buildPaginatedQuery<Comment>(api, {
    url: `/comments/${data.commentID}/replies`,
    entityKey: 'replies',
    class: Comment,
    cursor
})

const useCommentReplies = (data: CommentIDRequest) => useInfiniteQuery({
    queryKey: ['comments', data.commentID, 'replies'],
    queryFn: ({ pageParam = null }) => fetchReplies(data, pageParam),
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null
})

export default useCommentReplies