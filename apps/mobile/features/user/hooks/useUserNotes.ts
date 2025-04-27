import {UserIDRequest} from "@/features/user/types/requests";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import api from "@/common/services/api";
import {useInfiniteQuery} from "@tanstack/react-query";
import _ from "lodash";
import Note from "@/features/note/classes/Note";

const fetchUserNotes = async (data: UserIDRequest, cursor?: string | null) => await buildPaginatedQuery<Note>(api, {
    entityKey: 'notes',
    class: Note,
    url: `/user/${data.userID}/notes`,
    cursor: cursor
})

const useUserNotes = (data: UserIDRequest) => useInfiniteQuery({
    queryKey: ['users', data.userID, 'notes'],
    queryFn: ({ pageParam = null }) => fetchUserNotes(data, pageParam),
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null
})

export default useUserNotes