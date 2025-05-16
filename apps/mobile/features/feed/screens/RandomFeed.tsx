import {ActivityIndicator, FlatList, StyleSheet, Text, View, ViewabilityConfig, ViewToken} from 'react-native'
import {Fragment, useCallback, useMemo, useRef, useState} from "react";
import useFeedRandom from "@/features/feed/hooks/useFeedRandom";
import {FeedItemEntity} from "@/features/feed/types";
import FeedRenderItem from "@/features/feed/components/FeedRenderItem";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import useEventListener from "@/common/hooks/useEventListener";
import Queueable from "@/common/components/Queueable";
import {TODO} from "@/common/types/common";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import FeedPersonalizationTrigger from "@/features/feed/components/FeedPersonalizationTrigger";
import {palette, spacing} from "@/theme";
import {useUploadProgressStoreSelectors} from "@/features/upload/store/upload-progress";
import _ from 'lodash';
import FeedNoteTrigger from "@/features/feed/components/FeedNoteTrigger";

const RandomFeed = () => {

    const user = useGlobalUserContext()

    const progressActive = useUploadProgressStoreSelectors.active()

    const randomFeedQuery = useFeedRandom()

    const flatListReference = useRef<FlatList>(null)

    const [isRefreshing, setIsRefreshing] = useState(false)

    const [visibleIDs, setVisibleIDs] = useState<Set<number>>(new Set())

    const styles = useMemo(() => {
        return StyleSheet.create({
            container: {
                paddingBottom: 400
            },
            footerText: {
                paddingVertical: 24,
                color: palette.granite,
                textAlign: 'center',
            }
        })
    }, [])

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<FeedItemEntity>) => (
        <FeedRenderItem item={item} index={index} visible={item.getID && visibleIDs.has(item.getID())} />
    ), [visibleIDs])

    const ListHeaderComponent = useMemo(() => {
        if(!user) return <Fragment />
        if(user.getSettings().events >= 100) return <FeedNoteTrigger />
        return <FeedPersonalizationTrigger />
    }, [user, progressActive])

    const ListFooterComponent = useMemo(() => {
        if(randomFeedQuery.isFetchingNextPage) {
            return (
                <View style={{ paddingVertical: spacing.m }}>
                    <ActivityIndicator color={palette.olive} />
                </View>
            )
        }

        if(!randomFeedQuery.isFetchingNextPage && !randomFeedQuery.hasNextPage) {
            return (
                <Text style={styles.footerText}>That's all for now</Text>
            )
        }
    }, [randomFeedQuery.isFetchingNextPage, randomFeedQuery.hasNextPage])

    const handleScrollToTop = useCallback(async () => {
        flatListReference.current?.scrollToOffset({ animated: true, offset: 0 })
        setIsRefreshing(true)
        await randomFeedQuery.refetch()
        setTimeout(() => setIsRefreshing(false), 500)
    }, [randomFeedQuery])

    const viewabilityConfig: ViewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    }

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
        const ids = new Set<number>()
        viewableItems.forEach(({ item }: { item: FeedItemEntity }) => {
            if (_.isFunction(item.getID)) {
                ids.add(item.getID())
            }
        })
        setVisibleIDs(ids)
    }).current

    useEventListener('feed:refetch', randomFeedQuery.refetch)
    useEventListener('feed:top', handleScrollToTop)

    return(
        <Queueable query={randomFeedQuery as TODO}>
            <List
                <FeedItemEntity>
                infinite
                disableVirtualization
                refreshing={isRefreshing}
                query={randomFeedQuery}
                renderItem={RenderItem}
                componentRef={flatListReference}
                contentContainerStyle={styles.container}
                ListHeaderComponent={ListHeaderComponent}
                ListFooterComponent={ListFooterComponent}
                viewabilityConfig={viewabilityConfig}
                onViewableItemsChanged={onViewableItemsChanged}
            />
        </Queueable>
    )
}

export default RandomFeed
