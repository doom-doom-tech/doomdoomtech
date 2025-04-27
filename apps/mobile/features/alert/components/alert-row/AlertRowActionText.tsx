import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {useAlertContext} from "@/features/alert/context/AlertContextProvider";
import {palette} from "@/theme";
import Text from "@/common/components/Text";

interface AlertRowActionTextProps {

}

const AlertRowActionText = ({}: AlertRowActionTextProps) => {

    const alert = useAlertContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            container: {
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
            },
            text: {
                color: palette.granite,
                fontSize: 12
            }
        })
    }, []);

    const text = useMemo(() => {
        if(!alert) return ''
        return alert.getContent()
    }, [alert])

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {text}
            </Text>
        </View>
    )
}

export default AlertRowActionText