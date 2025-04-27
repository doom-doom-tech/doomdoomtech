import {StyleSheet, View} from 'react-native'
import {Fragment, useCallback} from "react";
import {useQueueStoreSelectors} from "@/common/store/queue";
import Track from "@/features/track/classes/Track";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import TrackRow from "@/features/track/components/track-row/TrackRow";
import BlockHeader from "@/common/components/block/BlockHeader";
import {router} from "expo-router";
import {wait} from "@/common/services/utilities";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import {spacing} from "@/theme";
import Animated, {FadeOutUp} from "react-native-reanimated";


interface NowPlayingQueueProps {}

const NowPlayingQueue = ({}: NowPlayingQueueProps) => {

    const queue = useQueueStoreSelectors.queue()

    const KeyExtractor = useCallback((item: Track) => {
        return String(item.getID())
    }, [])

    const styles = StyleSheet.create({
        wrapper: {
            gap: spacing.s,
        },
        header: {
            paddingHorizontal: spacing.m
        }
    })

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Track>) => (
        <Animated.View exiting={FadeOutUp}>
            <TrackContextProvider track={item} key={item.getID() + index}>
                <TrackRow type={'no-action'} />
            </TrackContextProvider>
        </Animated.View>
    ), [])

    const handleRouteQueue = useCallback(async () => {
        router.back()
        await wait(200)
        router.push('/queue')
    }, [])
    
    if(queue.length === 0 || queue.length === 1) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <BlockHeader
                style={styles.header}
                title={"Next up"}
                subtitle={"Edit"}
                callback={handleRouteQueue}
            />

            <List
                data={queue.slice(1)}
                keyExtractor={KeyExtractor}
                renderItem={RenderItem}
            />
        </View>
    )
}

export default NowPlayingQueue