import {useCallback, useEffect, useMemo, useState} from 'react';
import useUserTopPicks from '@/features/user/hooks/useUserTopPicks';
import useGlobalUserContext from '@/features/user/hooks/useGlobalUserContext';
import Track from '@/features/track/classes/Track';
import {useTopPicksStoreSelectors} from '@/features/list/store/top-picks';
import DragList, {DragListRenderItemInfo} from 'react-native-draglist';
import useEventListener from '@/common/hooks/useEventListener';
import _ from 'lodash';
import TopPicksEmpty from '@/features/list/components/TopPicksEmpty';
import Toast from 'react-native-root-toast';
import {convertToQueryResult, formatServerErrorResponse} from '@/common/services/utilities';
import {TOASTCONFIG} from '@/common/constants';
import useListRemoveTrack from '@/features/list/hooks/useListRemoveTrack';
import {DeviceEventEmitter, StyleSheet, useWindowDimensions} from 'react-native';
import Queueable from '@/common/components/Queueable';
import DraggableTrackRow from "@/features/track/components/track-row/DraggableTrackRow";

const TopPicksTracks = () => {
    const state = useTopPicksStoreSelectors.state();
    const updated = useTopPicksStoreSelectors.updated();
    const setTopPicksState = useTopPicksStoreSelectors.setState();

    const { width, height } = useWindowDimensions();

    const [removing, setRemoving] = useState<boolean>(false);

    const removeTrackMutation = useListRemoveTrack();

    const user = useGlobalUserContext();

    const [tracks, setTracks] = useState<Array<Track>>([]);

    const topPicksQuery = useUserTopPicks({ userID: user?.getID() ?? 0 });

    const styles = useMemo(() => {
        return StyleSheet.create({
            container: {

            },
        });
    }, []);

    useEffect(() => {
        if (topPicksQuery.isSuccess && topPicksQuery.data) setTracks(topPicksQuery.data);
    }, [topPicksQuery.data, topPicksQuery.isRefetching]);

    const handleRemoveTrack = useCallback(async (track: Track) => {
        try {
            await removeTrackMutation.mutateAsync({
                trackID: track.getID(),
            });
            setTracks((previous) => _.reject(previous, (p) => track.getID() === p.getID()));
            DeviceEventEmitter.emit('track:remove', track.getID());
        } catch (error: any) {
            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error);
        }
    }, []);

    const RenderItem = useCallback(
        (info: DragListRenderItemInfo<Track>) => {
            const { item, onDragStart: originalOnDragStart, onDragEnd: originalOnDragEnd, isActive, index } = info;

            // Custom handler for when the user starts dragging
            const handleLongPress = () => {
                if (state === 'idle') {
                    // Switch to 'edit' mode if currently in 'idle'
                    setTopPicksState({ state: 'edit' });
                }
                // Start the drag immediately
                originalOnDragStart();
            };

            // Only call onDragEnd if the item is being dragged
            const handlePressOut = isActive ? originalOnDragEnd : _.noop;

            return (
                <DraggableTrackRow
                    track={item}
                    index={index}
                    onDragStart={handleLongPress}
                    onDragEnd={handlePressOut}
                    isActive={isActive}
                    state={state}
                    onRemove={handleRemoveTrack}
                />
            );
        },
        [state, handleRemoveTrack, setTopPicksState]
    );

    const handleReordering = useCallback(
        (from: number, to: number) => {
            setTracks((prevTracks) => {
                const updatedTracks = [...prevTracks];
                const [movedTrack] = updatedTracks.splice(from, 1);
                updatedTracks.splice(to, 0, movedTrack);

                setTopPicksState({
                    updated: updatedTracks.map((track, __) => ({
                        trackID: track.getID(),
                        position: __,
                    })),
                });

                return updatedTracks;
            });
        },
        [updated]
    );

    useEventListener('track:save', topPicksQuery.refetch);
    useEventListener('track:remove', topPicksQuery.refetch);
    useEventListener('top-picks:refetch', topPicksQuery.refetch);

    return (
        <Queueable query={convertToQueryResult(tracks)}>
            <DragList
                data={tracks}
                ListEmptyComponent={TopPicksEmpty}
                contentContainerStyle={styles.container}
                onRefresh={topPicksQuery.refetch}
                refreshing={topPicksQuery.isRefetching}
                keyExtractor={(item) => String(item.getID())}
                onReordered={handleReordering}
                containerStyle={styles.container}
                renderItem={RenderItem}
            />
        </Queueable>
    );
};

export default TopPicksTracks;