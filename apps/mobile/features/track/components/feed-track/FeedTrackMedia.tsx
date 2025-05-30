import {DeviceEventEmitter, StyleSheet, useWindowDimensions, View} from 'react-native'
import {useCallback, useState} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import TrackCover from "@/features/track/components/TrackCover";
import FeedTrackInformation from "@/features/track/components/feed-track/FeedTrackInformation";
import FeedTrackAction from "@/features/track/components/feed-track/FeedTrackAction";
import FeedTrackShadow from "@/features/track/components/feed-track/FeedTrackShadow";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {runOnJS} from "react-native-reanimated";
import FeedTrackRate from "@/features/track/components/feed-track/FeedTrackRate";
import {TOASTCONFIG} from "@/common/constants";
import Toast from "react-native-root-toast";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import {router} from "expo-router";
import {useRatingQueueStoreSelectors} from "@/features/track/store/rating-queue";
import useEventListener from "@/common/hooks/useEventListener";
import Track from "@/features/track/classes/Track";

const FeedTrackMedia = () => {

    const track = useTrackContext()

    const user = useGlobalUserContext()

    const { width } = useWindowDimensions()

    const [rated, setRated] = useState<boolean>(track.liked())

    const eligibleRatingTracks = useRatingQueueStoreSelectors.eligible()

    const styles = StyleSheet.create({
        wrapper: {
            position: 'relative'
        },
    })

    const emitRatingIncreaseEvent = () => {
        if (!user) return router.push('/auth')
        if (rated) return Toast.show("You have already rated this track", TOASTCONFIG.warning)
        if (!eligibleRatingTracks.has(track.getID())) return Toast.show("Listen 10 seconds before you rate", TOASTCONFIG.warning)

        DeviceEventEmitter.emit('track:rate:start', track)
    }

    const navigateToTrack = useCallback(() => {
        router.push(`/track/${track.getID()}`)
    }, [track])

    const handleCompleteRating = useCallback((t: Track, amount: number) => {
        if(track.getID() === t.getID()) setRated(true)
    }, [track])

    const doubleTap = Gesture
        .Tap()
        .numberOfTaps(2)
        .onStart(() => {
            runOnJS(emitRatingIncreaseEvent)()
        });

    const singleTap = Gesture
        .Tap()
        .numberOfTaps(1)
        .onStart(() => {
            runOnJS(navigateToTrack)()
        });

    const combinedGestures = Gesture.Exclusive(doubleTap, singleTap);

    useEventListener('track:rate:fired', handleCompleteRating)

    return(
        <View style={styles.wrapper}>
            <GestureDetector gesture={combinedGestures}>
                <View>
                    {/* <TrackCover size={width} /> */}
                    <FeedTrackShadow />
                </View>
            </GestureDetector>


            <FeedTrackInformation />
            <FeedTrackAction />
            <FeedTrackRate />
        </View>
    )
}

export default FeedTrackMedia