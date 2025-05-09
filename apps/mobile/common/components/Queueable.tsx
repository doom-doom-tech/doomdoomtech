import {createContext, useCallback, useContext, useRef} from "react";
import {InfiniteData, UseInfiniteQueryResult, UseQueryResult} from "@tanstack/react-query";
import Track from "@/features/track/classes/Track";
import {WithChildren} from "@/common/types/common";
import * as Crypto from "expo-crypto";
import {extractItemsFromInfinityQuery} from "@/common/services/utilities";
import useEventListener from "@/common/hooks/useEventListener";
import useMediaActions from "@/common/hooks/useMediaActions";
import {PaginatedQueryResponse} from "@/common/services/buildPaginatedQuery";

interface QueueableProps extends WithChildren {
    query: UseInfiniteQueryResult<InfiniteData<PaginatedQueryResponse<Track>, unknown>, Error> | UseQueryResult<Array<Track>>
}

const QueueableContext = createContext<string>('');

const Queueable = ({query, children}: QueueableProps) => {

    const { fillQueue } = useMediaActions();

    const { current: listUUID} = useRef(Crypto.randomUUID())

    const assertInfiniteQuery = useCallback((query: QueueableProps['query']): query is UseInfiniteQueryResult<InfiniteData<PaginatedQueryResponse<Track>, unknown>, Error> => {
        if(query === undefined) return false
        return 'fetchNextPage' in query
    }, [])

    const handleFillQueue = useCallback(async (data: { listUUID: string }) => {
        if (data.listUUID !== listUUID) return

        if(assertInfiniteQuery(query)) {
            return await fillQueue(
                extractItemsFromInfinityQuery<Track>(query.data)
                    .filter(item => item.getType() == 'Track')
            )
        }

        if(query.data) {
            return await fillQueue(query.data)
        }
    }, [listUUID, query.data, fillQueue]);

    useEventListener('queue:construct', handleFillQueue);

    return(
        <QueueableContext.Provider value={listUUID}>
            {children}
        </QueueableContext.Provider>
    )
}

export const useQueueContext = () => useContext(QueueableContext)

export default Queueable