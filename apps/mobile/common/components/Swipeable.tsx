import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import {ReactElement} from 'react'
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import {View} from "react-native";
import {palette} from "@/theme";

interface SwipeableProps {
	top: ReactElement
	bottom: ReactElement
	style?: ViewStyle
}

const Swipeable = ({top, bottom, style = {}}: SwipeableProps) => {

	const translationValue = useSharedValue<number>(0)
	const swipedValue = useSharedValue<boolean>(false)

	const isSwiping = useSharedValue(false)

	const panGesture =
		Gesture
			.Pan()
			.activeOffsetX([-20, 20])
			.onUpdate((event) => {
				if(event.translationX < 0 && !swipedValue.value) {
					translationValue.value = withTiming(event.translationX)
				}
				if(event.translationX > 0 && swipedValue.value) {
					translationValue.value = withTiming(event.translationX)
				}
			})
			.onEnd((event) => {
				if(event.translationX > -100) {
					swipedValue.value = false
					translationValue.value = withTiming(0)
					return
				}
				translationValue.value = withTiming(-100)
				swipedValue.value = true
			})
			.onFinalize(() => {
				isSwiping.value = false
			})

	const composedGestures = Gesture.Race(panGesture)

	const translationStyle = useAnimatedStyle(() => {
		return {
			backgroundColor : palette.darkgrey,
			height : '100%',
			transform : [{ translateX : translationValue.value }]
		}
	})

	const styles: Record<string, ViewStyle> = {
		bottom: {
			flex: 1,
			backgroundColor: palette.purple,
			justifyContent: 'flex-end'
		}
	}

	return(
		<View style={{ height : '100%', backgroundColor: palette.transparent }}>
			<View style={styles.bottom}>
				{bottom}
			</View>

			<GestureDetector gesture={composedGestures}>
				<Animated.View style={{ ...translationStyle, ...style }}>
					{top}
				</Animated.View>
			</GestureDetector>
		</View>
	)
}

export default Swipeable