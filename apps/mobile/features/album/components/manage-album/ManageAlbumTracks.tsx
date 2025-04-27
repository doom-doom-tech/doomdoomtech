import {StyleSheet, useWindowDimensions, View} from 'react-native'
import React, {useCallback, useMemo, useState} from "react";
import {palette, spacing} from "@/theme";
import Text from "@/common/components/Text";
import {router} from "expo-router";
import TopPicksEmpty from "@/features/list/components/TopPicksEmpty";
import DragList, {DragListRenderItemInfo} from "react-native-draglist";
import {useManageAlbumStoreSelectors} from "@/features/album/store/manage-album";
import Track from "@/features/track/classes/Track";
import DraggableTrackRow from "@/features/track/components/track-row/DraggableTrackRow";
import _ from "lodash";
import AlbumTracksEmpty from "@/features/album/components/AlbumTracksEmpty";

interface ManageAlbumNameProps {
    onStartDragging: Function
    onEndDragging: Function
}

const ManageAlbumTracks = ({onStartDragging, onEndDragging}: ManageAlbumNameProps) => {

    const { width, height } = useWindowDimensions();

    const [isDragging, setIsDragging] = useState(false);

    const tracks = useManageAlbumStoreSelectors.tracks()
    const setManageAlbumState = useManageAlbumStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
                paddingVertical: spacing.m,
                borderBottomWidth: 1,
                borderColor: palette.granite
            },
            header: {
                paddingHorizontal: spacing.m,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            },
            title: {
                fontSize: 18,
                fontWeight: 'bold',
                color: palette.offwhite,
            },
            action: {
                color: palette.action
            },
            container: {
                height: height,
            },
        })
    }, [height]);

    const routeSelectTracks = useCallback(() => {
        router.push('/album/tracks')
    }, [])

    const handleDeselectTrack = useCallback((t: Track) => {
        return setManageAlbumState({ tracks: _.reject(tracks, track => track.getID() === t.getID()) })
    }, [tracks])

    const RenderItem = useCallback((info: DragListRenderItemInfo<Track>) => {
        const { item, onDragStart, onDragEnd, isActive, index } = info;

        const handleDragStart = () => {
            onStartDragging()
            onDragStart();
        };

        const handleDragEnd = () => {
            onEndDragging()
            onDragEnd();
        };

        return (
            <DraggableTrackRow
                track={item}
                index={index}
                state={'edit'}
                isActive={isActive}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                onRemove={handleDeselectTrack}
            />
        );
    }, [handleDeselectTrack, onStartDragging, onEndDragging]);

    const handleReordering = useCallback((from: number, to: number) => {
        // Create a copy of the tracks array to avoid directly modifying the state
        const reorderedTracks = [...tracks];

        // Remove the track from the original position (from)
        const [movedTrack] = reorderedTracks.splice(from, 1);

        // Insert the track at the new position (to)
        reorderedTracks.splice(to, 0, movedTrack);

        // Update the state with the new order of tracks
        setManageAlbumState({ tracks: reorderedTracks });
    }, [tracks, setManageAlbumState]);

    return(
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Tracks ({tracks.length})
                </Text>
                <Text style={styles.action} onPress={routeSelectTracks}>
                    Select
                </Text>
            </View>

            <DragList
                data={tracks}
                scrollEnabled={!isDragging}
                ListEmptyComponent={AlbumTracksEmpty}
                contentContainerStyle={styles.container}
                keyExtractor={(item) => String(item.getID())}
                onReordered={handleReordering}
                containerStyle={styles.container}
                renderItem={RenderItem}
            />
        </View>
    )
}

export default ManageAlbumTracks