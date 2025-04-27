import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import {Text} from "react-native";
import {palette} from "@/theme";

interface ParagraphProps {

}

const Paragraph = ({children}: { children: string }) => {

    const styles: Record<string, ViewStyle> = {
        text: {
            color: palette.offwhite
        }
    }

    return(
        <Text style={styles.text}>
	        {children}
        </Text>
    )
}

export default Paragraph