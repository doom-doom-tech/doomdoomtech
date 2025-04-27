import {Dimensions, StyleSheet, TouchableWithoutFeedback, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import {BlurView} from "expo-blur";
import Animated, {useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import useEventListener from "@/common/hooks/useEventListener";
import NewPostOverlayItems from "@/common/components/new-post/NewPostOverlayItems";
import {spacing} from "@/theme";

interface NewPostOverlayProps {

}

const screenSize = Dimensions.get('screen')

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const NewPostOverlay = ({}: NewPostOverlayProps) => {

    const opacity = useSharedValue(0)
    const blurAmount = useSharedValue(50)

    const [active, setActive] = useState(false)

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
                pointerEvents: active ? 'none' : 'auto',
                ...StyleSheet.absoluteFillObject,
            },
            content: {
                position: 'relative',
                paddingHorizontal: spacing.m,
                alignItems: 'center',
                justifyContent: 'center',
                width: screenSize.width,
                height: screenSize.height,
            },
            blurview: {
                width: screenSize.width,
                height: screenSize.height,
                ...StyleSheet.absoluteFillObject,
            }
        })
    }, []);

    const triggerNewPostOverlay = useCallback(() => {
        setActive(true)
        opacity.value = withTiming(1)
        blurAmount.value = withTiming(50)
    }, [])

    const animatedBlurProps = useAnimatedProps(() => {
        return {
            intensity: blurAmount.value,
        };
    });

    const AnimatedWrapperStyle = useAnimatedStyle(() => ({
        flex: 1,
        opacity: opacity.value,
        pointerEvents: active ? 'auto' : 'none',
        ...StyleSheet.absoluteFillObject,
    }))

    const handleCancel = useCallback(() => {
        setActive(false)
        opacity.value = withTiming(0)
        blurAmount.value = withTiming(0)
    }, [])

    useEventListener('triggerNewPostOverlay', triggerNewPostOverlay)

    return(
        <Animated.View style={AnimatedWrapperStyle}>
            <TouchableWithoutFeedback onPress={handleCancel}>
                <AnimatedBlurView
                    tint="dark"
                    style={styles.blurview}
                    animatedProps={animatedBlurProps}
                />
            </TouchableWithoutFeedback>
            <View style={styles.content}>
                { active && <NewPostOverlayItems onCancel={handleCancel}/> }
            </View>
        </Animated.View>
    )
}

export default NewPostOverlay