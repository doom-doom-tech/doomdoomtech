import {StyleSheet, View} from 'react-native'
import {Fragment, useCallback} from "react";
import Track from "@/features/track/classes/Track";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import {spacing} from "@/theme";
import TrackTile from "@/features/track/components/track-tile/TrackTile";
import _ from "lodash";
import {useQueueStoreSelectors} from "@/common/store/queue";
import Block from "@/common/components/block/Block";
import type {Track as NativeTrack} from "react-native-track-player"
import {useActiveTrack} from "react-native-track-player"

interface NowPlayingQueueProps {}

const NowPlayingQueue = ({}: NowPlayingQueueProps) => {

    const queue = useQueueStoreSelectors.queue()

    const activeNativeTrack: NativeTrack | undefined = useActiveTrack()

    const upcomingTracks = activeNativeTrack ? queue.slice(queue.findIndex(track => track.getID() === activeNativeTrack.id) + 1) : [];

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

    const renderItem = useCallback(({item}: ListRenderItemPropsInterface<Track>) => {
        return (
            <TrackContextProvider track={item} key={item.getID()}>
                <TrackTile />
            </TrackContextProvider>
        )
    }, [])

    if(upcomingTracks.length === 0 || upcomingTracks.length === 1) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <Block
                horizontal
                subtitle={""}
                callback={_.noop}
                title={"Next up"}
                data={upcomingTracks}
                renderItem={renderItem}
                keyExtractor={KeyExtractor}
                contentContainerStyle={{ paddingLeft: spacing.m, gap: spacing.m }}
            />
        </View>
    )
}

export default NowPlayingQueue
