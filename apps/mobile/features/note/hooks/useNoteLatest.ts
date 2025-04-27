import {useInfiniteQuery} from "@tanstack/react-query";
import {AdditionalRankedListParams} from "@/features/track/types";
import _ from "lodash";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import api from "@/common/services/api";
import {convertObjectToQueryParams} from "@/common/services/utilities";
import Note from "@/features/note/classes/Note";

const fetchLatestNotes = async (cursor: string | null, data: AdditionalRankedListParams) => {

    const response = await buildPaginatedQuery<Note>(api, {
        url: `/note${convertObjectToQueryParams(data)}`,
        class: Note,
        entityKey: 'notes',
        cursor: cursor
    })

    console.log(response.items.map(note => note.getContent()))

    return response
}

const useNoteLatest = (data: AdditionalRankedListParams) => useInfiniteQuery({
    queryFn: ({ pageParam = null }) => fetchLatestNotes(pageParam, data),
    getNextPageParam: lastPage => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null,
    queryKey: ['notes', data],
})

export default useNoteLatest