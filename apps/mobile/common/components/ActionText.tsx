import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useMemo} from "react";
import {palette} from "@/theme";

interface ActionTextProps {
    callback: (...args: Array<any>) => unknown
    loading: boolean
    label: string
}

const ActionText = ({callback, label, loading}: ActionTextProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            text: {
                fontSize: 18,
                color: palette.action
            }
        })
    }, []);

    return(
        <View>
            { loading
                ? <ActivityIndicator color={palette.olive} />
                : <Text style={styles.text} onPress={callback}>{label}</Text>
            }
        </View>
    )
}

export default ActionText