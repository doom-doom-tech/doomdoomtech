import {Fragment, useEffect, useRef} from "react";
import LottieView from "lottie-react-native";
import {usePlaybackState} from "react-native-track-player";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import {useMediaStoreSelectors} from "@/common/store/media";

interface EqualizerAnimationProps {
    size: number
}

const EqualizerAnimation = ({size = 24}: EqualizerAnimationProps) => {

    const track = useTrackContext()
    const currentTrack = useMediaStoreSelectors.current()

    const state = usePlaybackState()

    const opacity = useSharedValue(0)

    const animationReference = useRef<LottieView>(null)

    useEffect(() => {
        if(!animationReference.current) return;

        if(state.state === 'playing') {
            opacity.value = withTiming(1)
            animationReference.current.play()
            return
        }

        if(state.state === 'paused') {
            animationReference.current.pause()
            setTimeout(() => opacity.value = withTiming(0), 2000)
        }
    }, [state]);

    const AnimatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }))

    if(track.getUUID() !== currentTrack?.getUUID()) return <Fragment />

    return (
        <Animated.View style={AnimatedStyle}>
            <LottieView
                ref={animationReference}
                autoPlay={false}
                loop={true}
                resizeMode={"cover"}
                style={{height: size * 0.66, width: size}}
                source={require('@/assets/animations/equalizer.json')}
            />
        </Animated.View>
    )
}

export default EqualizerAnimation