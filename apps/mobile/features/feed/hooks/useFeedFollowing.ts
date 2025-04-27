import {useInfiniteQuery} from "@tanstack/react-query";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import api from "@/common/services/api";
import _ from "lodash";
import Track from "@/features/track/classes/Track";
import Note from "@/features/note/classes/Note";
import Album from "@/features/album/classes/Album";
import {FeedItemEntity} from "@/features/feed/types";

class Mock {
    constructor() {}
}

const fetchRandomFeed = async (cursor: string | null) => {
    // 1. Fetch the paginated data as usual.
    const result = await buildPaginatedQuery<FeedItemEntity>(api, (data: any) => {
        let relevantEntityClass;

        switch (data.type) {
            case "Track":
                relevantEntityClass = Track;
                break;
            case "Note":
                relevantEntityClass = Note;
                break;
            case "Album":
                relevantEntityClass = Album;
                break;
        }

        return {
            url: "/feed/following",
            entityKey: "items",
            class: relevantEntityClass,
            cursor: cursor,
        };
    });

    // 2. Insert an advertisement object after every 3rd item.
    const itemsWithAds: FeedItemEntity[] = [];

    result.items.forEach((item: FeedItemEntity, index: number) => {
        itemsWithAds.push(item);

        // For every 3rd item (index 2, 5, 8, ... in 0-based indexing), insert an ad
        if ((index + 1) % 3 === 0) {
            itemsWithAds.push({
                getType: () => "Advertisement",
            } as unknown as FeedItemEntity);
        }
    });

    // 3. Return the updated result with ads injected into the `items` array.
    return {
        ...result,
        items: itemsWithAds,
    };
};

const useFeedRandom = () => useInfiniteQuery({
    queryFn: ({pageParam = null}) => fetchRandomFeed(pageParam),
    queryKey: ['feed', 'following'],
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
    initialPageParam: null as string | null
})

export default useFeedRandom