import {DeviceEventEmitter, StyleSheet, useWindowDimensions, View} from 'react-native'
import {useCallback, useEffect, useRef} from "react";
import Animated, {runOnJS, useAnimatedScrollHandler, useSharedValue} from "react-native-reanimated";
import {Image, ImageStyle} from "expo-image";
import {useFocusEffect} from "expo-router";
import {useOnboardingStoreSelectors} from "@/features/onboarding/store/onboarding";
import {ReanimatedScrollEvent} from "react-native-reanimated/lib/typescript/hook/commonTypes";
import {palette} from "@/theme";
import _ from "lodash";
import {StatusBar} from "expo-status-bar";
import Landing from "@/assets/images/onboarding/Landing.png"
import Earn from "@/assets/images/onboarding/Earn.png"
import Upload from "@/assets/images/onboarding/Upload.png"
import Charts from "@/assets/images/onboarding/Charts.png"
import Rate from "@/assets/images/onboarding/Rate.png"
import OnboardingHeader from "@/features/onboarding/components/OnboardingHeader";
import OnboardingActionButton from "@/features/onboarding/components/OnboardingActionButton";

const Onboarding = () => {

    const scrollviewRef = useRef<Animated.ScrollView>(null)

    const { width, height } = useWindowDimensions()

    const contentOffset = useSharedValue(0)

    const styles = StyleSheet.create({
        wrapper: {
            flex: 1,
            position: 'relative',
            backgroundColor: palette.darkgrey
        },
        image: {
            width: width,
            height: height
        }
    })

    useFocusEffect(useCallback(() => {
        setTimeout(() => DeviceEventEmitter.emit('tabbar:hide'), 300)
        return () => DeviceEventEmitter.emit('tabbar:show')
    }, []))

    const currentOnboardingIndex = useOnboardingStoreSelectors.index()
    const setOnboardingState = useOnboardingStoreSelectors.setState()

    const handleDebouncedStoreUpdate = useCallback(_.debounce((offset: number) => {
        setOnboardingState({ index: Math.round(offset / width) })
    }, 100), [width])

    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event: ReanimatedScrollEvent) => {
            contentOffset.value = event.contentOffset.x
            runOnJS(handleDebouncedStoreUpdate)(event.contentOffset.x)
        }
    }, [handleDebouncedStoreUpdate])

    useEffect(() => {
        if(!scrollviewRef.current) return
        scrollviewRef.current.scrollTo(0, currentOnboardingIndex * width, true)
    }, [currentOnboardingIndex])

    const images = [
        Landing, Upload, Charts, Rate, Earn,
    ]

    return(
        <View style={styles.wrapper}>
            <Animated.ScrollView horizontal pagingEnabled ref={scrollviewRef} showsHorizontalScrollIndicator={false} onScroll={handleScroll}>
                { _.map(images, (image, __) =>
                    <Image key={__} source={image} style={styles.image as ImageStyle} />
                )}
            </Animated.ScrollView>

            <OnboardingHeader contentOffset={contentOffset} />
            <OnboardingActionButton />

            <StatusBar style="light" />
        </View>
    )
}

export default Onboarding