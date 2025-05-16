import {DeviceEventEmitter, StyleSheet, View} from 'react-native'
import {useCallback, useState} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import IconLabel from "@/common/components/icon/IconLabel";
import {spacing} from "@/theme";
import Comments from "@/assets/icons/Comments";
import Flame from "@/assets/icons/Flame";
import FlameFilled from "@/assets/icons/FlameFilled";
import useEventListener from "@/common/hooks/useEventListener";
import millify from "millify";
import Track from "@/features/track/classes/Track";
import {router} from "expo-router";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import {useShareStoreSelectors} from "@/features/share/store/share";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import {useAlgoliaEvents} from "@/common/hooks/useAlgoliaEvents";
import Share from "@/assets/icons/Share";
import TopPicksTrigger from "@/features/list/components/TopPicksTrigger";
import {useRatingQueueStoreSelectors} from "@/features/track/store/rating-queue";

const FeedTrackMetrics = () => {

    const track = useTrackContext()

    const user = useGlobalUserContext()

    const { shareTrack } = useAlgoliaEvents()

    const setShareState = useShareStoreSelectors.setState()
    const eligibleRatingTracks = useRatingQueueStoreSelectors.eligible()
    const currentRatingQueue = useRatingQueueStoreSelectors.current()

    const [rated, setRated] = useState<boolean>(track.liked())
    const [likes, setLikes] = useState<number>(track.getLikesCount())

    const currentlyRatingActive = (track && currentRatingQueue)
        && currentRatingQueue.id === track.getID()

    const styles = StyleSheet.create({
        wrapper: {
            paddingHorizontal: spacing.m,
            paddingRight: spacing.l,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        actions: {
            flexDirection: 'row',
            gap: spacing.m
        },
    })

    const handleRouteCommentSheet = useCallback(() => {
        router.push(`/(sheets)/comments/Track/${track.getID()}`)
    }, [])

    const handleShareTrack = useCallback(() => {
        shareTrack(track.getID())
        setShareState({ entity: track })
        router.push('/share')
    }, [track])

    const handleTriggerTrackRating = useCallback(() => {
        if(!user) return router.push('/auth')
        if(rated) return Toast.show("You have already rated this track", TOASTCONFIG.warning)
        if(!eligibleRatingTracks.has(track.getID())) return Toast.show("Listen 10 seconds before you rate", TOASTCONFIG.warning)
        DeviceEventEmitter.emit('track:rate:start', track)
    }, [track, user, rated, eligibleRatingTracks])

    const handleIncrementLikes = useCallback((t: Track, amount: number) => {
        if(track.getID() === t.getID()) {
            setRated(true)
            setLikes(previous => previous + amount)
        }
    }, [track])

    useEventListener('track:rate:complete', handleIncrementLikes)

    return(
        <View style={styles.wrapper}>
            <View style={styles.actions}>
                <IconLabel
                    disabled={!eligibleRatingTracks.has(track.getID())}
                    icon={(rated || currentlyRatingActive) ? <FlameFilled /> : <Flame />}
                    callback={handleTriggerTrackRating}
                    label={millify(likes)}
                />

                <IconLabel
                    icon={<Comments />}
                    callback={handleRouteCommentSheet}
                    label={String(track.getCommentsCount())}
                />

                <IconLabel
                    icon={<Share />}
                    callback={handleShareTrack}
                    label={''}
                />
            </View>

            <TopPicksTrigger />
        </View>
    )
}

export default FeedTrackMetrics