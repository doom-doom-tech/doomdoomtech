import {View} from 'react-native'
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import {useCallback, useMemo} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {spacing} from "@/theme";
import {useRouter} from "expo-router";
import Button from "@/common/components/buttons/Button"
import {useOnboardingStoreSelectors} from "@/features/onboarding/store/onboarding";

const OnboardingActionButton = () => {

	const { bottom } = useSafeAreaInsets()

    const styles: Record<string, ViewStyle> = {
		wrapper: {
			position: 'absolute',
			bottom: bottom + spacing.l,
			left: 0,
			right: 0,
			justifyContent: 'center',
			alignItems: 'center'
		},
	    button: {
			width: 250
	    }
    }

	const router = useRouter()
	const index = useOnboardingStoreSelectors.index()
	const setOnboardingState = useOnboardingStoreSelectors.setState()

	const handleCompleteOnboarding = useCallback(() => {
		setOnboardingState({ completed: true })
		router.replace('/feed')
	}, [setOnboardingState, router])

	const buttonLabel = useMemo(() => {
	    return index === 4 ? "Get started" : "Next"
	}, [index])

	const handlePress = useCallback(() => {
		if(index === 4) {
			return handleCompleteOnboarding()
		}

		setOnboardingState({ index: index + 1 })
	}, [index, setOnboardingState, handleCompleteOnboarding])

    return(
        <View style={styles.wrapper}>
            <Button label={buttonLabel} loading={false} callback={handlePress} />
        </View>
    )
}

export default OnboardingActionButton