import {DeviceEventEmitter, StyleSheet, TouchableOpacity, View} from 'react-native'
import {useCallback, useEffect, useMemo, useState} from "react";
import IconButton from "@/common/components/buttons/IconButton";
import Flame from "@/assets/icons/Flame";
import {spacing} from "@/theme";
import TrackPlayer, {State, usePlaybackState} from "react-native-track-player";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import FlameFilled from "@/assets/icons/FlameFilled";
import useEventListener from "@/common/hooks/useEventListener";
import Track from "@/features/track/classes/Track";
import {router} from "expo-router";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import {useRatingQueueStoreSelectors} from "@/features/track/store/rating-queue";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import TrackPlayButton from "@/features/track/components/TrackPlayButton";
import Comments from "@/assets/icons/Comments";
import Share from "@/assets/icons/Share";
import Queue from "@/assets/icons/Queue";
import Note from "@/assets/icons/Note";
import Previous from "@/assets/icons/Previous";
import Next from "@/assets/icons/Next";
import useTrackActions from "@/features/track/hooks/useTrackActions";
import useCurrentTrack from "@/features/track/hooks/useCurrentTrack";

const NowPlayingActions = () => {

    const user = useGlobalUserContext()

    const current = useCurrentTrack()

    const currentRatingQueue = useRatingQueueStoreSelectors.current()
    const eligibleRatingTracks = useRatingQueueStoreSelectors.eligible()

    const {comments, share, queue, note} = useTrackActions(current)

    const state = usePlaybackState()

    const [saved, setSaved] = useState<boolean>(current?.saved() ?? false)
    const [rated, setRated] = useState<boolean>(current?.liked() ?? false)

    const active = useMemo(() => {
        return state.state === State.Playing
    }, [state, current])

    const buffering = useMemo(() => {
        return state.state === (State.Buffering || State.Loading)
    }, [state])

    const handleTriggerTrackRating = () => {
        if (!user) return router.push('/auth')
        if(rated) return Toast.show("You have already rated this track", TOASTCONFIG.warning)
        if (!eligibleRatingTracks.has(current!.getID())) return Toast.show("Listen 10 seconds before you rate", TOASTCONFIG.warning)
        DeviceEventEmitter.emit('track:rate:start', current)
    }

    const styles = StyleSheet.create({
        wrapper: {
            gap: spacing.m,
        },
        bottom: {
            flexDirection: 'row',
            alignSelf: 'center',
            gap: spacing.m,
        },
        top: {
            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'center',
            gap: spacing.xl,
        }
    })

    const handleNext = useCallback(async () => {
        await TrackPlayer.skipToNext()
    }, [])

    const handlePrevious = useCallback(async () => {
        await TrackPlayer.skipToPrevious()
    }, [])

    useEffect(() => {
        setSaved(current?.saved() ?? false)
        setRated(current?.liked() ?? false)
    }, [current]);

    const handleCompleteRating = useCallback((t: Track) => {
        if(current && t.getID() === current.getID()) setRated(true)
    }, [current])

    const handleShare = useCallback(async () => {

    }, [])

    const handleQueue = useCallback(async () => {

    }, [])

    const currentlyRatingActive = (current && currentRatingQueue)
        && currentRatingQueue.id === current.getID()

    useEventListener('track:rate:complete', handleCompleteRating)

    if(!current) return <View />

    return(
        <View style={styles.wrapper}>
            <TrackContextProvider track={current}>
                <View style={styles.top}>
                    <TouchableOpacity onPress={handlePrevious}>
                        <Previous />
                    </TouchableOpacity>

                    <TrackPlayButton size={50} />

                    <TouchableOpacity onPress={handleNext}>
                        <Next />
                    </TouchableOpacity>
                </View>

                <View  style={styles.bottom}>
                    <IconButton
                        disabled={!eligibleRatingTracks.has(current.getID())}
                        icon={(rated || currentlyRatingActive) ? <FlameFilled /> : <Flame />}
                        fill={'darkgrey'}
                        callback={handleTriggerTrackRating}
                    />
                    <IconButton
                        icon={<Comments />}
                        fill={'darkgrey'}
                        callback={comments}
                    />
                    <IconButton
                        icon={<Share />}
                        fill={'darkgrey'}
                        callback={share}
                    />
                    <IconButton
                        icon={<Queue />}
                        fill={'darkgrey'}
                        callback={queue}
                    />
                    <IconButton
                        icon={<Note />}
                        fill={'darkgrey'}
                        callback={note}
                    />
                </View>
            </TrackContextProvider>
        </View>
    )
}

export default NowPlayingActions
