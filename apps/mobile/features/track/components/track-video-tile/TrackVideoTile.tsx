import {View, StyleSheet, DeviceEventEmitter, TouchableOpacity} from 'react-native'
import {useCallback, useMemo} from "react";
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import TrackCover from "@/features/track/components/TrackCover";
import {LinearGradient} from "expo-linear-gradient";
import TrackInformation from "@/features/track/components/TrackInformation";
import {spacing} from "@/theme";
import useMediaActions from "@/common/hooks/useMediaActions";
import {useQueueContext} from "@/common/components/Queueable";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";

interface TrackVideoTileProps {
    size: number
}

const TrackVideoTile = ({size = 200}: TrackVideoTileProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            overlay: {
                width: size,
                height: size / 2,
                position: 'absolute',
                bottom: 0
            },
            gradient: {
                width: size,
                height: size,
            },
            information: {
                position: 'absolute',
                left: spacing.m,
                bottom: spacing.m,
            }
        })
    }, []);

    const track = useTrackContext()

    const { loadTrack } = useMediaActions()

    const listUUID = useQueueContext()

    const handleLoadTrack = useCallback(async () => {
        // First emit the queue:construct event to ensure the queue is properly constructed
        DeviceEventEmitter.emit('queue:construct', { listUUID });

        // Then load and play the track
        await loadTrack(track)

        DeviceEventEmitter.emit('notes:mute')
    }, [track, listUUID])

    return(
        <TouchableOpacity style={styles.wrapper} activeOpacity={0.5} onPress={handleLoadTrack}>
            <TrackCover
                size={size}
            />

            <View style={styles.overlay}>
                <LinearGradient
                    colors={['#00000000', '#000000']}
                    style={styles.gradient}
                />
            </View>

            <View style={styles.information}>
                <TrackInformation />
            </View>
        </TouchableOpacity>
    )
}

export default TrackVideoTile
