import {useInfiniteQuery} from "@tanstack/react-query";
import api from "@/common/services/api";
import _ from "lodash";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import {AdditionalRankedListParams} from "@/features/track/types";
import {convertObjectToQueryParams} from "@/common/services/utilities";
import Label from "@/features/label/classes/Label";

const fetchLatestNotes = async (cursor: string | null, data: AdditionalRankedListParams) => await buildPaginatedQuery<Label>(api, {
    url: `/label/latest${convertObjectToQueryParams(data)}`,
    class: Label,
    entityKey: 'labels',
    cursor: cursor
})

const useNoteLatest = (data: AdditionalRankedListParams) => useInfiniteQuery({
    queryFn: ({ pageParam = null }) => fetchLatestNotes(pageParam, data),
    getNextPageParam: lastPage => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null,
    queryKey: ['label', 'latest', data],
})

export default useNoteLatest