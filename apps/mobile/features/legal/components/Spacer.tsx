import {View} from 'react-native'
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import {spacing} from "@/theme";

interface SpacerProps {

}

const Spacer = ({}: SpacerProps) => {

    const styles: Record<string, ViewStyle> = {
		wrapper: {
			paddingVertical: spacing.s
		}
    }

    return(
        <View style={styles.wrapper}>

        </View>
    )
}

export default Spacer