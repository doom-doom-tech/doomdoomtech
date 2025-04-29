import {DeviceEventEmitter, StyleSheet, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import IconLabel from "@/common/components/icon/IconLabel";
import {spacing} from "@/theme";
import Comments from "@/assets/icons/Comments";
import Send from "@/assets/icons/Send";
import Save from "@/assets/icons/Save";
import SaveFilled from "@/assets/icons/SaveFilled";
import Flame from "@/assets/icons/Flame";
import FlameFilled from "@/assets/icons/FlameFilled";
import useEventListener from "@/common/hooks/useEventListener";
import millify from "millify";
import Track from "@/features/track/classes/Track";
import useListSaveTrack from "@/features/list/hooks/useListSaveTrack";
import useListRemoveTrack from "@/features/list/hooks/useListRemoveTrack";
import {router} from "expo-router";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import {useShareStoreSelectors} from "@/features/share/store/share";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import {useAlgoliaEvents} from "@/common/hooks/useAlgoliaEvents";
import Share from "@/assets/icons/Share";
import Heart from "@/assets/icons/Heart";
import HeartFilled from "@/assets/icons/HeartFilled";
import TopPicksTrigger from "@/features/list/components/TopPicksTrigger";

const FeedTrackMetrics = () => {

    const track = useTrackContext()

    const user = useGlobalUserContext()

    const { shareTrack } = useAlgoliaEvents()

    const setShareState = useShareStoreSelectors.setState()

    const [saved, setSaved] = useState<boolean>(track.saved())
    const [liked, setLiked] = useState<boolean>(track.liked())
    const [likes, setLikes] = useState<number>(track.getLikesCount())

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingHorizontal: spacing.m,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            },
            actions: {
                flexDirection: 'row',
                gap: spacing.m
            },
        })
    }, []);

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
        if(track.liked()) return Toast.show("You have already rated this track", TOASTCONFIG.warning)
        DeviceEventEmitter.emit('track:rate:trigger', track)
    }, [track, user])

    const handleIncrementLikes = useCallback((t: Track, amount: number) => {
        if(track.getID() === t.getID()) {
            setLiked(true)
            setLikes(previous => previous + amount)
        }
    }, [])

    useEventListener('track:likes:increase', handleIncrementLikes)

    return(
        <View style={styles.wrapper}>
            <View style={styles.actions}>
                <IconLabel
                    icon={liked ? <FlameFilled /> : <Flame />}
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