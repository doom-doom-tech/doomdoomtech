import {StyleSheet, Text, TouchableOpacity} from 'react-native'
import {ReactElement, useMemo} from "react";
import {palette, spacing} from "@/theme";

interface NewPostOverlayItemProps {
    icon: ReactElement
    label: string
    callback: (...args: Array<any>) => unknown
}

const NewPostOverlayItem = ({label, icon, callback}: NewPostOverlayItemProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            },
            label: {
                fontSize: 18,
                color: palette.offwhite,
            }
        })
    }, []);

    return (
        <TouchableOpacity style={styles.wrapper} onPress={callback}>
            {icon}
            <Text style={styles.label}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}

export default NewPostOverlayItem