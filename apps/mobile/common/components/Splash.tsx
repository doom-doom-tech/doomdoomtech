import {StyleSheet, useWindowDimensions} from 'react-native'
import {Image} from "expo-image";
import SplashImage from "../../assets/images/splash.png"
import {useCallback} from "react";
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {SplashScreen} from "expo-router";
import {palette} from "@/theme";
import useEventListener from "@/common/hooks/useEventListener";

const springConfig = {
	damping: 20,
	mass: 1,
	stiffness: 100,
	overshootClamping: false,
	restSpeedThreshold: 0.001,
	restDisplacementThreshold: 0.001,
};

const Splash = () => {

    const styles = StyleSheet.create({
		image: {
			width: '100%',
			height: '100%'
		}
    })

	const translate = useSharedValue(0)

	const { width, height } = useWindowDimensions()

	const handleHideSplashScreen = useCallback(async () => {
		await SplashScreen.hideAsync();
		translate.value = withSpring(height * -1, springConfig)
	}, [height])

	useEventListener('splash:hide', handleHideSplashScreen)

	const AnimatedImageStyle = useAnimatedStyle(() => ({
		...StyleSheet.absoluteFillObject,
		backgroundColor: palette.transparent,
		transform: [{ translateY: translate.value }]
	}))

    return(
        <Animated.View style={AnimatedImageStyle}>
            <Image
	            style={styles.image}
	            source={SplashImage}
	            contentFit={"cover"}
            />
        </Animated.View>
    )
}

export default Splash