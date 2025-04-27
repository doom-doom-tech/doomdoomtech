import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, useWindowDimensions, View} from 'react-native'
import Animated, {Extrapolate, interpolate, interpolateColor, SharedValue, useAnimatedStyle} from "react-native-reanimated";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useRouter} from "expo-router";
import {palette} from "@/theme";
import {useOnboardingStoreSelectors} from "@/features/onboarding/store/onboarding";

interface OnboardingHeaderProps {
	contentOffset: SharedValue<number>
}

const OnboardingHeader = ({ contentOffset }: OnboardingHeaderProps) => {

	const { top } = useSafeAreaInsets()
	const { width } = useWindowDimensions()

	const styles = StyleSheet.create({
		wrapper: {
			position: 'absolute',
			paddingVertical: 20,
			justifyContent: 'space-between',
			flexDirection: 'row',
			top: top,
			left: 0,
			width: '100%',
		},
		indicators: {
			alignSelf: 'center',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
		},
		skipContainer: {
			width: 50,
		},
		skipLabel: {
			opacity: 0.5,
			fontSize: 18,
			color: palette.offwhite
		}
	})

	const getAnimatedIndicatorStyle = (index: number) => useAnimatedStyle(() => {
		const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

		return {
			height: 12,
			borderRadius: 2,
			marginHorizontal: 4,
			backgroundColor: interpolateColor(
				contentOffset.value,
				inputRange,
				[palette.offwhite, palette.olive, palette.offwhite]
			),
			width: interpolate(
				contentOffset.value,
				inputRange,
				[10, 30, 10],
				Extrapolate.CLAMP
			),
			opacity: interpolate(
				contentOffset.value,
				inputRange,
				[0.5, 1, 0.5],
				Extrapolate.CLAMP
			),
		}
	})

	const setOnboardingState = useOnboardingStoreSelectors.setState()

	const router = useRouter()

	const handleCompleteOnboarding = useCallback(() => {
		setOnboardingState({ completed: true })
	    router.push('/(tabs)/(feed)/feed')
	}, [setOnboardingState, router])

	return (
		<View style={styles.wrapper}>
			<View style={styles.skipContainer}></View>

			<View style={styles.indicators}>
				{[...Array(5)].map((_, index) => (
					<Animated.View key={index} style={getAnimatedIndicatorStyle(index)} />
				))}
			</View>

			<Pressable style={styles.skipContainer} onPress={handleCompleteOnboarding}>
				<Text style={styles.skipLabel}>skip</Text>
			</Pressable>
		</View>
	);
};

export default OnboardingHeader;