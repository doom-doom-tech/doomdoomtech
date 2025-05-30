import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'
import { Fragment, useCallback, useMemo, useRef, useState } from "react";
import useEventListener from "@/common/hooks/useEventListener";
import List, { ListRenderItemPropsInterface } from "@/common/components/List";
import { FeedItemEntity } from "@/features/feed/types";
import FeedRenderItem from "@/features/feed/components/FeedRenderItem";
import useFeedFollowing from "@/features/feed/hooks/useFeedFollowing";
import { extractItemsFromInfinityQuery } from "@/common/services/utilities";
import _ from 'lodash';
import FollowingFeedEmpty from "@/features/feed/components/FollowingFeedEmpty";
import { palette, spacing } from "@/theme";
import useGlobalUserContext from '@/features/user/hooks/useGlobalUserContext';
import FeedPersonalizationTrigger from "@/features/feed/components/FeedPersonalizationTrigger";
import FeedNoteTrigger from "@/features/feed/components/FeedNoteTrigger";
import { useUploadProgressStoreSelectors } from '@/features/upload/store/upload-progress';
import { TODO } from '@/common/types/common';
import Queueable from '@/common/components/Queueable';
import UploadProgressIndicator from '../components/progress-indicator/UploadProgressIndicator';


const FollowingFeed = () => {

    const user = useGlobalUserContext()

    const followingFeedQuery = useFeedFollowing()

    const progressActive = useUploadProgressStoreSelectors.active()

    const [isRefreshing, setIsRefreshing] = useState(false)

    const flatListReference = useRef<FlatList>(null)

    const [visibleIDs, setVisibleIDs] = useState<Set<number>>(new Set())

    const styles = useMemo(() => {
        return StyleSheet.create({
            container: {
                paddingBottom: 400
            }
        })
    }, []);

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<FeedItemEntity>) => (
        <FeedRenderItem item={item} index={index} visible={item.getID && visibleIDs.has(item.getID())} />
    ), [visibleIDs])

    const ListHeaderComponent = useMemo(() => {
        if (!user) return <Fragment />
        if (user.getSettings().events >= 100) return <FeedNoteTrigger />
        return <FeedPersonalizationTrigger />
    }, [user, progressActive])

    const ListFooterComponent = useMemo(() => {
        if (followingFeedQuery.isFetchingNextPage) {
            return (
                <View style={{ paddingVertical: spacing.m }}>
                    <ActivityIndicator color={palette.olive} />
                </View>
            )
        } else {
            return <Fragment />
        }
    }, [followingFeedQuery.isFetchingNextPage])

    const handleScrollToTop = useCallback(async () => {
        flatListReference.current?.scrollToOffset({ animated: true, offset: 0 })
        setIsRefreshing(true)
        await followingFeedQuery.refetch()
        setTimeout(() => setIsRefreshing(false), 500)
    }, [followingFeedQuery])

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

    useEventListener('feed:refetch', followingFeedQuery.refetch)
    useEventListener('feed:top', handleScrollToTop)

    if (
        _.isEmpty(extractItemsFromInfinityQuery(followingFeedQuery.data))
        && !followingFeedQuery.isFetching
        && !followingFeedQuery.isFetchingNextPage
        && !followingFeedQuery.isFetchingPreviousPage
        && !followingFeedQuery.isRefetching
        && !followingFeedQuery.isLoading
    ) {
        return <FollowingFeedEmpty onFollow={followingFeedQuery.refetch} />
    }

    return (
        <Queueable query={followingFeedQuery as TODO}>
            <List
                <FeedItemEntity>
                infinite
                disableVirtualization
                query={followingFeedQuery}
                renderItem={RenderItem}
                refreshing={isRefreshing}
                componentRef={flatListReference}
                ListHeaderComponent={ListHeaderComponent}
                ListFooterComponent={ListFooterComponent}
                contentContainerStyle={styles.container}
                viewabilityConfig={viewabilityConfig}
                onViewableItemsChanged={onViewableItemsChanged}
            />
        </Queueable>
    )
}

export default FollowingFeed