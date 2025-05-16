import {ActivityIndicator, DeviceEventEmitter, Pressable, StyleSheet, TouchableOpacity} from 'react-native'
import {useCallback, useMemo} from "react";
import {palette} from "@/theme";
import Pause from "@/assets/icons/Pause";
import Play from "@/assets/icons/Play";
import Animated, {FadeIn} from 'react-native-reanimated'
import {WithChildren} from "@/common/types/common";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import TrackPlayer, {State, useActiveTrack, usePlaybackState} from "react-native-track-player"
import useMediaActions from "@/common/hooks/useMediaActions";
import {useQueueStoreSelectors} from "@/common/store/queue";
import {useQueueContext} from "@/common/components/Queueable";

interface TrackPlayButtonProps {
    size?: number
}

const TrackPlayButton = ({ size = 50 }: TrackPlayButtonProps) => {

    const track = useTrackContext()
    const state = usePlaybackState()
    const listUUID = useQueueContext()

    const queue = useQueueStoreSelectors.queue()
    const current = useActiveTrack()

    const { loadTrack } = useMediaActions()

    const active = useMemo(() => {
        return state.state === State.Playing && current?.id === track.getID()
    }, [state, current])

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                backgroundColor: palette.rose,
                width: size,
                height: size,
                borderRadius: 1000,
                justifyContent: 'center',
                alignItems: 'center'
            },
            icon: {
                width: 24,
                height: 24
            }
        })
    }, [size]);

    const handlePlayRequest = useCallback(async () => {

        DeviceEventEmitter.emit('notes:mute')

        if(current?.id !== track.getID()) {
            DeviceEventEmitter.emit('queue:construct', { listUUID });

            // Then load and play the track
            await loadTrack(track)

            return
        }

        active
            ? await TrackPlayer.pause()
            : await TrackPlayer.play()
    }, [current, track, active, listUUID, queue])

    const AnimatedIcon = useCallback(({children}: WithChildren) => {
        return(
            <Animated.View entering={FadeIn}>
                { children }
            </Animated.View>
        )
    }, [])

    if(state.state === 'buffering') return(
        <TouchableOpacity style={styles.wrapper} activeOpacity={0.95}>
            <ActivityIndicator color={palette.offwhite} />
        </TouchableOpacity>
    )

    return(
        <Pressable style={styles.wrapper} onPress={handlePlayRequest}>
            { active
                ? <AnimatedIcon><Pause color={palette.offwhite} style={styles.icon} /></AnimatedIcon>
                : <AnimatedIcon><Play color={palette.offwhite} style={styles.icon} /></AnimatedIcon>
            }
        </Pressable>
    )
}

export default TrackPlayButton
