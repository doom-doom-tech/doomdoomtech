import {useInfiniteQuery} from "@tanstack/react-query";
import api from "@/common/services/api";
import _ from "lodash";
import Track from "@/features/track/classes/Track";
import Note from "@/features/note/classes/Note";
import {FeedItemEntity} from "@/features/feed/types";
import {TODO} from "@/common/types/common";
import {buildPaginatedQuery} from "@/common/services/buildPaginatedQuery";
import Album from "@/features/album/classes/Album";

const fetchRandomFeed = async (cursor: TODO) => {
    const response = await buildPaginatedQuery<FeedItemEntity>(api, (data: any) => {
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
            url: "/feed/personalized",
            entityKey: "items",
            class: relevantEntityClass,
            cursor: cursor,
        };
    });

    // 2. Insert an advertisement object after every 3rd item.
    const itemsWithAds: FeedItemEntity[] = [];

    response.items.forEach((item: FeedItemEntity, index: number) => {
        itemsWithAds.push(item);

        // For every 3rd item (index 2, 5, 8, ... in 0-based indexing), insert an ad
        if ((index + 1) % 3 === 0) {
            itemsWithAds.push({
                getType: () => "Advertisement",
            } as unknown as FeedItemEntity);
        }
    });



    // Add SuggestedUsers item only on the first page
    if (cursor === 0) {
        itemsWithAds.push({
            getType: () => "SuggestedUsers",
        } as unknown as FeedItemEntity);
    }

    // 3. Return the updated result with ads injected into the `items` array.
    return {
        ...response,
        items: itemsWithAds,
    };
};

const useFeedRandom = () => useInfiniteQuery({
    queryFn: ({pageParam = 0}) => fetchRandomFeed(pageParam),
    queryKey: ['feed', 'personalized'],
    initialPageParam: 0 as string | number | null,
    getNextPageParam: (lastPage) => _.get(lastPage, 'next_page', null),
})

export default useFeedRandom