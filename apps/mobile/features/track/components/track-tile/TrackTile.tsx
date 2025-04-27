import {DeviceEventEmitter, StyleSheet, TouchableOpacity} from 'react-native'
import {useCallback, useMemo} from "react";
import TrackCover from "@/features/track/components/TrackCover";
import TrackTileInformation from "@/features/track/components/track-tile/TrackTileInformation";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import useMediaActions from "@/common/hooks/useMediaActions";
import {useQueueContext} from "@/common/components/Queueable";

interface TrackTileProps {
    size?: number
}

const TrackTile = ({size = 150}: TrackTileProps) => {

    const track = useTrackContext()

    const { loadTrack } = useMediaActions()

    const listUUID = useQueueContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                width: size,
            }
        })
    }, [size]);

    const handleLoadTrack = useCallback(async () => {
        // First emit the queue:construct event to ensure the queue is properly constructed
        DeviceEventEmitter.emit('queue:construct', { listUUID });

        // Then load and play the track
        await loadTrack(track)

        DeviceEventEmitter.emit('notes:mute')
    }, [track, listUUID])

    return(
        <TouchableOpacity style={styles.wrapper} activeOpacity={0.5} onPress={handleLoadTrack}>
            <TrackCover size={size} />
            <TrackTileInformation center />
        </TouchableOpacity>
    )
}

export default TrackTile
