import {useCallback} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import useEventListener from "@/common/hooks/useEventListener";
import TrackRate from "@/features/track/components/TrackRate";

const NowPlayingRate = () => {

    const track = useTrackContext()

    const opacity = useSharedValue(0)
    const translate = useSharedValue(20)

    const wrapperStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translate.value }],
        position: 'absolute',
        alignSelf: 'center',
        top: '20%',
        alignItems: 'center',
    }))

    const activate = useCallback(() => {
        opacity.value = withTiming(1)
        translate.value = withTiming(0)
    }, [])

    const deactivate = useCallback(async () => {
        opacity.value = withTiming(0)
        translate.value = withTiming(20)
    }, [track])

    useEventListener('track:rate:start', activate)
    useEventListener('track:rate:fired', deactivate)

    return(
        <Animated.View style={wrapperStyle}>
            <TrackRate />
        </Animated.View>
    )
}

export default NowPlayingRate