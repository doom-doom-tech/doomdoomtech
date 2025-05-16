import {useCallback, useState} from "react";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import TrackRate from "@/features/track/components/TrackRate";
import Track from "@/features/track/classes/Track";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import useEventListener from "@/common/hooks/useEventListener";

interface FeedTrackRateProps {

}

const SingleTrackRating = ({}: FeedTrackRateProps) => {

    const track = useTrackContext()

    const opacity = useSharedValue(0)
    const translate = useSharedValue(20)

    const [liked, setLiked] = useState<boolean>(track.liked())
    const [active, setActive] = useState<boolean>(false)

    const wrapperStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translate.value }],
        position: 'absolute',
        alignSelf: 'center',
        top: '35%',
        alignItems: 'center',
    }))

    const activate = useCallback(() => {
        setActive(true)
        opacity.value = withTiming(1)
        translate.value = withTiming(0)
    }, [])

    const handleTriggerRating = useCallback((t: Track) => {
        if(track.getID() === t.getID()) {
            if(liked) return Toast.show('You have already rated this track', TOASTCONFIG.warning)
            activate()
        }
    }, [liked, activate])

    const handleIncreaseRating = useCallback((t: Track) => {
        if(track.getID() !== t.getID()) return
        activate()
    }, [activate])

    const handleCompleteRating = useCallback(async (amount: number) => {
        setLiked(true)
        setActive(false)

        opacity.value = withTiming(0)
        translate.value = withTiming(20)
    }, [track])

    useEventListener('track:rate:complete', handleCompleteRating)

    return(
        <Animated.View style={wrapperStyle}>
            <TrackRate />
        </Animated.View>
    )
}

export default SingleTrackRating