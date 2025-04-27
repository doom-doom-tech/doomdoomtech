import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native'
import {ReactElement, useCallback, useMemo} from "react";
import {palette, spacing} from "@/theme";
import {ViewStyle} from "react-native/Libraries/StyleSheet/StyleSheetTypes";

export interface ButtonProps {
    label: string
    loading?: boolean
    icon?: ReactElement
    color?: keyof typeof palette
    border?: keyof typeof palette
    fill?: keyof typeof palette
    disabled?: boolean
    callback: (...args: Array<any>) => unknown
}

const Button = ({disabled, label, icon, border = 'transparent', color = 'black', fill = 'rose', loading, callback}: ButtonProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            labelGroup: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            },
            label: {
                fontWeight: 'bold',
                color: palette[color]
            }
        })
    }, [color]);

    const Content = useMemo(() => (
        <View style={styles.labelGroup}>
            { label && <Text style={styles.label}>
                {label}
            </Text> }
            {icon}
        </View>
    ), [icon, label, styles])

    const formatWrapperStyle = useCallback((pressed: boolean) => ({
        flexGrow: 1,
        borderRadius: 4,
        borderWidth: 2,
        maxHeight: 50,
        borderColor: palette[border],
        padding: spacing.m,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: disabled ? palette.granite : palette[fill],
        transform: [{ scale: pressed ? 0.95 : 1 }],
        alignSelf: 'center',
    } satisfies ViewStyle), [fill, disabled, border])

    return(
        <Pressable style={({ pressed }) => formatWrapperStyle(pressed)} onPress={disabled ? null : callback}>
            { loading && <ActivityIndicator color={palette[color]} /> }
            { !loading && Content }
        </Pressable>
    )
}

export default Button