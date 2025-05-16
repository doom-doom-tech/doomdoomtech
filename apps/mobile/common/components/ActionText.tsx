import {ActivityIndicator, StyleSheet, Text, View} from 'react-native'
import {palette} from "@/theme";

interface ActionTextProps {
    disabled?: boolean
    callback: (...args: Array<any>) => unknown
    loading: boolean
    label: string
}

const ActionText = ({disabled, callback, label, loading}: ActionTextProps) => {

    const styles = StyleSheet.create({
        wrapper: {
            opacity: disabled ? 0.5 : 1
        },
        text: {
            fontSize: 18,
            color: palette.action
        }
    })

    return(
        <View style={styles.wrapper}>
            { loading
                ? <ActivityIndicator color={palette.olive} />
                : <Text style={styles.text} onPress={callback}>{label}</Text>
            }
        </View>
    )
}

export default ActionText