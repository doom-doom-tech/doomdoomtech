import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import Comment from "@/features/comment/classes/Comment";
import api from "@/common/services/api";
import {NoteIDRequest} from "@/features/note/types/requests";
import {useInfiniteQuery} from "@tanstack/react-query";
import _ from "lodash";

const fetchNoteComments = async (data: NoteIDRequest, cursor: string | null) => await buildPaginatedQuery<Comment>(api, {
    url: `/note/${data.noteID}/comments`,
    class: Comment,
    entityKey: 'comments',
    cursor: cursor
})

const useNoteComments = (data: NoteIDRequest) => useInfiniteQuery({
    queryKey: ['notes', data.noteID, 'comments'],
    queryFn: ({pageParam}) => fetchNoteComments(data, pageParam),
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null
})

export default useNoteComments