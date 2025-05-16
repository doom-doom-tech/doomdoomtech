import React, {useCallback, useEffect} from 'react';
import {DeviceEventEmitter, TouchableOpacity} from 'react-native';
import Animated, {interpolateColor, useAnimatedStyle, useSharedValue, withTiming,} from 'react-native-reanimated';
import TrackContextProvider from '@/features/track/context/TrackContextProvider';
import TopPicksTrackRow from '@/features/track/components/track-row/TopPicksTrackRow';
import {palette} from '@/theme';
import Track from '@/features/track/classes/Track';
import useMediaActions from "@/common/hooks/useMediaActions";
import {useQueueContext} from "@/common/components/Queueable";

interface DraggableTrackRowProps {
    track: Track;
    index: number;
    onDragStart: () => void;
    onDragEnd: () => void;
    isActive: boolean;
    state: string;
    onRemove: (track: Track) => void;
}

const DraggableTrackRow: React.FC<DraggableTrackRowProps> = ({
    track,
    index,
    onDragStart,
    onDragEnd,
    isActive,
    state,
    onRemove,
}) => {
    const activeShared = useSharedValue(isActive ? 1 : 0);

    useEffect(() => {
        activeShared.value = withTiming(isActive ? 1 : 0, { duration: 200 });
    }, [isActive]);

    const animatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            activeShared.value,
            [0, 1],
            ['transparent', palette.granite]
        );
        return {
            backgroundColor,
        };
    });

    const { loadTrack } = useMediaActions()

    const listUUID = useQueueContext()

    const handleLoadTrack = useCallback(async () => {
        // First emit the queue:construct event to ensure the queue is properly constructed
        DeviceEventEmitter.emit('queue:construct', { listUUID });

        // Then load and play the track
        await loadTrack(track)

        DeviceEventEmitter.emit('notes:mute')
    }, [track, listUUID])

    return (
        <TouchableOpacity
            delayLongPress={200}
            style={{ width: '100%', height: 80, justifyContent: 'center' }}
            onPress={handleLoadTrack}
            onLongPress={onDragStart}
            onPressOut={onDragEnd}>
            <Animated.View
                style={[
                    animatedStyle,
                    { width: '100%', height: '100%', justifyContent: 'center' },
                ]}>
                <TrackContextProvider track={track}>
                    <TopPicksTrackRow
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onRemove={onRemove}
                        numbered
                        index={index + 1}
                        type={state === 'edit' ? 'remove' : 'options'}
                    />
                </TrackContextProvider>
            </Animated.View>
        </TouchableOpacity>
    );
};

export default DraggableTrackRow;
