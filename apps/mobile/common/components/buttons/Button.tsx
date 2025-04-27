import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native'
import {ReactElement, useCallback, useMemo} from "react";
import {palette, spacing} from "@/theme";
import {ViewStyle} from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import _ from 'lodash';

export interface ButtonProps {
    label: string
    loading?: boolean
    icon?: ReactElement
    color?: keyof typeof palette
    border?: keyof typeof palette
    fill?: keyof typeof palette
    disabled?: boolean
    fullWidth?: boolean // Added new prop
    callback: (...args: Array<any>) => unknown
}

const Button = ({
                    disabled,
                    label,
                    icon,
                    border = 'transparent',
                    color = 'black',
                    fill = 'rose',
                    loading,
                    fullWidth = false, // Default to false
                    callback
                }: ButtonProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            labelGroup: {
                gap: spacing.s,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            },
            label: {
                fontFamily: 'Syne',
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
        flexGrow: fullWidth ? 1 : 1,
        width: fullWidth ? '100%' : undefined,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: palette[border],
        padding: spacing.m,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: disabled ? palette.granite : palette[fill],
        transform: [{ scale: pressed ? 0.95 : 1 }],
        alignSelf: fullWidth ? 'stretch' : 'center',
    } satisfies ViewStyle), [fill, disabled, border, fullWidth])

    return(
        <Pressable style={({ pressed }) => formatWrapperStyle(pressed)} onPress={disabled ? _.noop : callback}>
            { loading && <ActivityIndicator color={palette[color]} /> }
            { !loading && Content }
        </Pressable>
    )
}

export default Button