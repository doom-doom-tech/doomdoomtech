import {DeviceEventEmitter, StyleSheet, useWindowDimensions, View} from 'react-native'
import {useCallback, useMemo} from "react";
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
import {useVisiblityContext} from "@/common/context/VisiblityContextProvider";

interface FeedTrackMediaProps {

}

const FeedTrackMedia = ({}: FeedTrackMediaProps) => {

    const track = useTrackContext()

    const user = useGlobalUserContext()

    const { width } = useWindowDimensions()

    const visible = useVisiblityContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'relative'
            },
        })
    }, []);

    const emitRatingIncreaseEvent = useCallback(() => {
        if(!user) return router.push('/auth')
        if(track.liked()) return Toast.show("You have already rated this track", TOASTCONFIG.warning)
        DeviceEventEmitter.emit('track:rate:start', track)
    }, [track, user])

    const doubleTap = Gesture
        .Tap()
        .numberOfTaps(2)
        .onStart(() => {
            runOnJS(emitRatingIncreaseEvent)()
        });

    return(
        <GestureDetector gesture={doubleTap}>
            <View style={styles.wrapper}>
                <TrackCover size={width} visible={visible} />
                <FeedTrackShadow />
                <FeedTrackInformation />
                <FeedTrackAction />
                <FeedTrackRate />
            </View>
        </GestureDetector>
    )
}

export default FeedTrackMedia