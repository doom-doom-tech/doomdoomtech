import {useInfiniteQuery} from "@tanstack/react-query";
import _ from "lodash";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import api from "@/common/services/api";
import Note from "@/features/note/classes/Note";

const searchNotes = async (query: string, cursor: string | null) => await buildPaginatedQuery<Note>(api, {
    cursor: cursor,
    url: `/note/search?query=${query}`,
    entityKey: 'notes',
    class: Note
})

const useNoteSearch = (query: string) => useInfiniteQuery({
    queryKey: ['search', 'notes', query],
    initialPageParam: <string | null>null,
    queryFn: ({ pageParam = null }) => searchNotes(query, pageParam),
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null)
})

export default useNoteSearch