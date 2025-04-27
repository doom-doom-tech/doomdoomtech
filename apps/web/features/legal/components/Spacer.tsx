import {StyleSheet, View} from 'react-native'
import {spacing} from "@/theme";

interface SpacerProps {

}

const Spacer = ({}: SpacerProps) => {

    const styles = StyleSheet.create({
        wrapper: {
            paddingVertical: spacing.s
        }
    })

    return(
        <View style={styles.wrapper}>

        </View>
    )
}

export default Spacer