import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import {View} from "react-native";
import AlertRowUsernames from "@/features/alert/components/alert-row/AlertRowUsernames";
import AlertRowActionText from "@/features/alert/components/alert-row/AlertRowActionText";

const AlertRowText = () => {

    const styles: Record<string, ViewStyle> = {
        wrapper: {
            maxWidth: 250,
            flexDirection: 'column'
        }
    }

    return(
        <View style={styles.wrapper}>
            <AlertRowUsernames />
            <AlertRowActionText />
        </View>
    )
}

export default AlertRowText