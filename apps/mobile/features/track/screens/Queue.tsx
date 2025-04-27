import {StyleSheet} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import {useQueueStoreSelectors} from "@/common/store/queue";
import Track from "@/features/track/classes/Track";
import TrackPlayer from "react-native-track-player";
import DragList, {DragListRenderItemInfo} from "react-native-draglist";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import TrackRow from "@/features/track/components/track-row/TrackRow";
import Header from "@/common/components/header/Header";
import Screen from "@/common/components/Screen";
import {spacing} from "@/theme";

type QueueStates = 'idle' | 'edit'

interface QueueProps {

}

const Queue = ({}: QueueProps) => {

    const [state, setState] = useState<QueueStates>('idle')

    const queue = useQueueStoreSelectors.queue()
    const setQueueState = useQueueStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            container: {
                height: 400,
                gap: spacing.s
            },
            dragHandle: {
                width: 30,
                height: '100%',
                position: 'absolute',
                right: 0,
                // Optional: Add some visual indication for drag handle
                backgroundColor: 'rgba(0,0,0,0.1)'
            }
        })
    }, []);

    const KeyExtractor = useCallback((item: Track) => {
        return String(item.getID())
    }, [])


    const handleReordering = useCallback(async (from: number, to: number) => {
        try {
            // Since queue.slice(1) is used in DragList, we need to offset by 1
            const actualFrom = from + 1;
            const actualTo = to + 1;

            // Create new queue array for Zustand store
            const newQueue = [...queue];
            const [movedItem] = newQueue.splice(actualFrom, 1);
            newQueue.splice(actualTo, 0, movedItem);

            // Update Zustand store
            setQueueState({ queue: newQueue });

            // Update TrackPlayer queue using move method
            await TrackPlayer.move(actualFrom, actualTo);

        } catch (error) {
            console.error('Error reordering queue:', error);
            // Optionally revert the store changes if TrackPlayer fails
            setQueueState({ queue });
        }
    }, [queue]);

    const RenderItem = useCallback((info: DragListRenderItemInfo<Track>) => {
        const {item, onDragStart, onDragEnd, isActive, index} = info;

        return (
            <TrackContextProvider track={item} key={item.getID() + index}>
                <TrackRow
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    type={state === 'edit' ? 'remove' : 'drag'}/>
            </TrackContextProvider>
        )
    }, [state])

    return(
        <Screen>
            <Header title={"Next up"} />
            <DragList
                data={queue.slice(1)}
                contentContainerStyle={styles.container}
                keyExtractor={KeyExtractor}
                onReordered={handleReordering}
                containerStyle={styles.container}
                renderItem={RenderItem}
            />
        </Screen>
    )
}

export default Queue