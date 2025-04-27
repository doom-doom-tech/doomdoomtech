import {Pressable, View} from 'react-native'
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import Check from "@/assets/icons/Check";
import Close from "@/assets/icons/Close";
import {palette, spacing} from "@/theme";


interface AlertRowConfirmationProps {
	onConfirm: () => unknown
	onDecline: () => unknown
}

const AlertRowConfirmation = ({onConfirm, onDecline}: AlertRowConfirmationProps) => {

    const styles: Record<string, ViewStyle> = {
		wrapper: {
			flexDirection: 'row',
			gap: spacing.m
		},
	    pressable: {
			padding: spacing.s
	    }
    }

    return(
        <View style={styles.wrapper}>
	        <Pressable onPress={onDecline} style={styles.pressable}>
				<Close color={palette.error} />
	        </Pressable>
            <Pressable onPress={onConfirm} style={styles.pressable}>
	            <Check color={palette.olive} />
            </Pressable>
        </View>
    )
}

export default AlertRowConfirmation