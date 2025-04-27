import {Dimensions, StyleSheet, View} from 'react-native'
import {useCallback, useEffect, useMemo} from "react";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {useMediaStoreSelectors} from "@/common/store/media";
import {palette} from "@/theme";
import TrackPlayer, {useProgress} from "react-native-track-player"
import MediaEventEmitter from "@/common/classes/MediaEventEmitter";

const { width: screenWidth } = Dimensions.get('window')

const BottomPlayerProgress = () => {

    const progress = useProgress()

    const current = useMediaStoreSelectors.current()
    const duration = useMediaStoreSelectors.duration()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'relative'
            },
            progress: {
                height: 10,
                bottom: 0,
                position: 'absolute',
                width: screenWidth / 2,
                backgroundColor: palette.rose
            },
            backdrop: {
                height: 10,
                position: 'absolute',
                bottom: 0,
                width: screenWidth,
                backgroundColor: palette.granite
            }
        })
    }, []);

    const width = useSharedValue(0);
    const seeking = useSharedValue(false);

    const handleSeek = useCallback(async (seconds: number) => {
        await TrackPlayer.seekTo(seconds)
        MediaEventEmitter.emit('SEEK', { position: seconds })
    }, [current])

    // Worklet function for finishing seek
    const finishSeekWorklet = (currentWidth: number = width.value) => {
        'worklet';

        const percentage = Math.floor((currentWidth / screenWidth) * 100);
        const seconds = Math.floor(duration * (percentage / 100));

        runOnJS(handleSeek)(seconds)
    };

    const gesture = Gesture.Simultaneous(
        // Tap gesture
        Gesture.Tap()
            .onStart((event) => {
                'worklet';

                width.value = event.absoluteX
                finishSeekWorklet();
            }),

        // Pan gesture
        Gesture.Pan()
            .onStart((event) => {
                'worklet';
                seeking.value = true;
                width.value = event.absoluteX
            })
            .onUpdate((event) => {
                'worklet';

                width.value = event.absoluteX
                finishSeekWorklet();
            })
            .onEnd(() => {
                'worklet';
                seeking.value = false;
                finishSeekWorklet();
            })
    );

    const animatedBackdropStyle = useAnimatedStyle(() => ({
        height: 10,
        position: 'absolute',
        bottom: 0,
        width: screenWidth,
        backgroundColor: palette.granite
    }))

    const animatedProgressStyle = useAnimatedStyle(() => ({
        height: 10,
        position: 'absolute',
        bottom: 0,
        width: width.value,
        backgroundColor: seeking.value ? palette.olive : palette.rose
    }))

    useEffect(() => {
        width.value = withTiming((progress.position / duration) * screenWidth)
    }, [progress]);

    return(
        <GestureDetector gesture={gesture}>
            <View style={styles.wrapper}>
                <Animated.View style={animatedBackdropStyle} />
                <Animated.View style={animatedProgressStyle} />
            </View>
        </GestureDetector>
    )
}

export default BottomPlayerProgress