import {ActivityIndicator, DeviceEventEmitter, StyleSheet, View} from 'react-native'
import {useCallback, useEffect, useMemo, useState} from "react";
import IconButton from "@/common/components/buttons/IconButton";
import Save from "@/assets/icons/Save";
import Flame from "@/assets/icons/Flame";
import Pause from "@/assets/icons/Pause";
import Next from "@/assets/icons/Next";
import {spacing} from "@/theme";
import {useMediaStoreSelectors} from "@/common/store/media";
import TrackPlayer, {State, usePlaybackState} from "react-native-track-player";
import Play from "@/assets/icons/Play";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import FlameFilled from "@/assets/icons/FlameFilled";
import {useQueueStoreSelectors} from "@/common/store/queue";
import SaveFilled from "@/assets/icons/SaveFilled";
import useListSaveTrack from "@/features/list/hooks/useListSaveTrack";
import useListRemoveTrack from "@/features/list/hooks/useListRemoveTrack";
import useEventListener from "@/common/hooks/useEventListener";
import Track from "@/features/track/classes/Track";
import {router} from "expo-router";
import More from "@/assets/icons/More";
import {wait} from "@/common/services/utilities";
import {useAlgoliaEvents} from "@/common/hooks/useAlgoliaEvents";

interface NowPlayingActionsProps {

}

const NowPlayingActions = ({}: NowPlayingActionsProps) => {

    const current = useMediaStoreSelectors.current()
    const removeQueueTrack = useQueueStoreSelectors.removeTrack()

    const state = usePlaybackState()
    const { viewItem } = useAlgoliaEvents()

    const saveTrackMutation = useListSaveTrack()
    const removeTrackMutation = useListRemoveTrack()

    const [saved, setSaved] = useState<boolean>(current?.saved() ?? false)
    const [liked, setLiked] = useState<boolean>(current?.liked() ?? false)

    const active = useMemo(() => {
        return state.state === State.Playing
    }, [state, current])

    const buffering = useMemo(() => {
        return state.state === (State.Buffering || State.Loading)
    }, [state])

    const handleTriggerTrackRating = useCallback(() => {
        if(liked) return Toast.show("You have already rated this track", TOASTCONFIG.warning)
        DeviceEventEmitter.emit('track:rate:trigger', current)
    }, [current])

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flexDirection: 'row',
                alignSelf: 'center',
                gap: spacing.m,
            },
        })
    }, []);

    const handleSave = useCallback(() => {
        if(!current) return
        saved ? removeTrackMutation.mutate({ trackID: current.getID() }) : saveTrackMutation.mutate({ trackID: current.getID() })
        setSaved(prevState => !prevState)
    }, [current, saved]);

    const handleNext = useCallback(async () => {
        await TrackPlayer.remove([0])
        await removeQueueTrack(0)
        await TrackPlayer.play()
    }, [])

    const handleRouteSingle = useCallback(async () => {
        if(!current) return

        viewItem(current.getID(), 'track')

        router.back()
        await wait(200)
        router.push(`/track/${current.getID()}`)
    }, [])

    const togglePlayback = useCallback(async () => {
        active
            ? await TrackPlayer.pause()
            : await TrackPlayer.play()
    }, [active])

    const catchRatingEvent = useCallback((t: Track) => {
        if(current?.getID() !== t.getID()) return
        setLiked(true)
    }, [])

    useEffect(() => {
        setSaved(current?.saved() ?? false)
        setLiked(current?.liked() ?? false)
    }, [current]);

    useEventListener('track:rate', catchRatingEvent)

    return(
        <View style={styles.wrapper}>
            <IconButton
                icon={saved ? <SaveFilled /> : <Save />}
                fill={'darkgrey'}
                callback={handleSave}
            />
            <IconButton
                icon={liked ? <FlameFilled /> : <Flame />}
                fill={'darkgrey'}
                callback={handleTriggerTrackRating}
            />
            <IconButton
                icon={buffering ? <ActivityIndicator /> : active ? <Pause /> : <Play />}
                fill={'rose'}
                callback={togglePlayback}
            />
            <IconButton
                icon={<Next />}
                fill={'darkgrey'}
                callback={handleNext}
            />
            <IconButton
                icon={<More />}
                fill={'darkgrey'}
                callback={handleRouteSingle}
            />
        </View>
    )
}

export default NowPlayingActions