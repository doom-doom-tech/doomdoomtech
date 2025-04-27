import {useInfiniteQuery} from "@tanstack/react-query";
import _ from "lodash";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import Alert from "@/features/alert/classes/Alert";
import api from "@/common/services/api";

const fetchAlerts = async (cursor: string | null) => await buildPaginatedQuery<Alert>(api, {
    entityKey: 'alerts',
    class: Alert,
    url: '/alert',
    cursor: cursor
})

const useAlerts = () => useInfiniteQuery({
    queryFn: ({ pageParam = null }) => fetchAlerts(pageParam),
    queryKey: ['alerts'],
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null
})

export default useAlerts