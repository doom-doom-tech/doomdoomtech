import {Text, TextStyle} from 'react-native'
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import {palette} from "@/theme";


const Title = ({children}: { children: string }) => {

    const styles: Record<string, ViewStyle | TextStyle> = {
		text: {
			fontSize: 18,
			fontWeight: '600',
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