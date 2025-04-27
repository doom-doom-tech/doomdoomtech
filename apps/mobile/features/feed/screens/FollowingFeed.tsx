import {ActivityIndicator, StyleSheet, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import useEventListener from "@/common/hooks/useEventListener";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import {FeedItemEntity} from "@/features/feed/types";
import FeedRenderItem from "@/features/feed/components/FeedRenderItem";
import useFeedFollowing from "@/features/feed/hooks/useFeedFollowing";
import {extractItemsFromInfinityQuery} from "@/common/services/utilities";
import _ from 'lodash';
import FollowingFeedEmpty from "@/features/feed/components/FollowingFeedEmpty";
import {palette, spacing} from "@/theme";

const FollowingFeed = () => {

    const followingFeedQuery = useFeedFollowing()

    const styles = useMemo(() => {
        return StyleSheet.create({
            container: {
                paddingBottom: 400
            }
        })
    }, []);

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<FeedItemEntity>) => (
        <FeedRenderItem item={item} index={index} />
    ), [])

    const ListFooterComponent = useMemo(() => {
        if(followingFeedQuery.isFetchingNextPage) {
            return (
                <View style={{ paddingVertical: spacing.m }}>
                    <ActivityIndicator color={palette.olive} />
                </View>
            )
        } else {
            return <Fragment />
        }
    }, [followingFeedQuery.isFetchingNextPage])

    useEventListener('feed:refetch', followingFeedQuery.refetch)

    if(_.isEmpty(extractItemsFromInfinityQuery(followingFeedQuery.data))) {
        return <FollowingFeedEmpty onFollow={followingFeedQuery.refetch} />
    }

    return(
        <List
            <FeedItemEntity>
            infinite
            disableVirtualization
            query={followingFeedQuery}
            renderItem={RenderItem}
            ListFooterComponent={ListFooterComponent}
            contentContainerStyle={styles.container}
        />
    )
}

export default FollowingFeed