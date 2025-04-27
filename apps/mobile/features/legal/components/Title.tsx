import {Text, TextStyle} from 'react-native'
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import {palette} from "@/theme";

const Title = ({children}: { children: string }) => {

    const styles: Record<string, ViewStyle | TextStyle> = {
		text: {
			fontSize: 24,
			fontWeight: 'bold',
            color: palette.offwhite
		}
    }

    return(
        <Text style={styles.text}>
	        { children }
        </Text>
    )
}

export default Title