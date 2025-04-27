import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {ReactElement, useCallback, useMemo} from "react";
import {palette, spacing, styling} from "@/theme";
import Switch from "@/common/components/inputs/Switch";

interface SwitchConsentProps {
    icon?: ReactElement
    label: string
    value: boolean
    callback: (value: boolean) => void

}

const SwitchConsent = ({icon, label, value, callback}: SwitchConsentProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flexDirection: 'row',
                paddingHorizontal: spacing.m,
                justifyContent: 'space-between',
            },
            label: {
                color: palette.offwhite
            }
        })
    }, []);

    const handlePress = useCallback(() => {
        callback(!value)
    }, [value])

    return(
        <TouchableOpacity style={styles.wrapper} onPress={handlePress}>
            <View style={styling.row.m}>
                { icon && icon }
                <Text style={styles.label}>
                    {label}
                </Text>
            </View>
            <Switch
                value={value}
                callback={callback}
            />
        </TouchableOpacity>
    )
}

export default SwitchConsent