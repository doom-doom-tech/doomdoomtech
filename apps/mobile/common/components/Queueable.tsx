import {createContext, useCallback, useContext, useRef} from "react";
import {InfiniteData, UseInfiniteQueryResult, UseQueryResult,} from "@tanstack/react-query";
import Track from "@/features/track/classes/Track";
import Note from "@/features/note/classes/Note";
import {WithChildren} from "@/common/types/common";
import * as Crypto from "expo-crypto";
import {assertInfiniteQuery, extractItemsFromInfinityQuery} from "@/common/services/utilities";
import useEventListener from "@/common/hooks/useEventListener";
import useMediaActions from "@/common/hooks/useMediaActions";
import {PaginatedQueryResponse} from "@/common/services/buildPaginatedQuery";

// Define the union type for queue items
type QueueItem = Track | Note;

// Define specific types for query results
type InfiniteQueryResult = UseInfiniteQueryResult<
    InfiniteData<PaginatedQueryResponse<QueueItem>, unknown>,
    Error
>;
type RegularQueryResult = UseQueryResult<QueueItem[], Error>;

// Update the interface to use the union of query types
interface QueueableProps extends WithChildren {
    query: InfiniteQueryResult | RegularQueryResult;
}

const QueueableContext = createContext<string>("");

const Queueable = ({ query, children }: QueueableProps) => {

    const { fillQueue } = useMediaActions();
    const listUUIDRef = useRef(Crypto.randomUUID());

    const handleFillQueue = useCallback(async (data: { listUUID: string }) => {        
        if (data.listUUID !== listUUIDRef.current) return;
        
        if (assertInfiniteQuery(query)) {
            return await fillQueue(
                extractItemsFromInfinityQuery<QueueItem>(query.data).filter(
                    (item): item is Track => item.getType() === "Track"
                )
            );
        }

        if (query.data) {
            return await fillQueue(
                query.data.filter((item): item is Track => item.getType() === "Track")
            );
        }
    }, [query, fillQueue]);

    useEventListener("queue:construct", handleFillQueue);

    return (
        <QueueableContext.Provider value={listUUIDRef.current}>
            {children}
        </QueueableContext.Provider>
    );
};

export const useQueueContext = () => useContext(QueueableContext);

export default Queueable;