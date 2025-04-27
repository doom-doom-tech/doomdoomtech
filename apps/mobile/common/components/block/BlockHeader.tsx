import {StyleSheet, Text, View, ViewProps} from 'react-native'
import {useMemo} from "react";
import {palette, spacing} from "@/theme";

interface BlockHeaderProps extends ViewProps {
    title: string
    subtitle: string
    callback: (...args: Array<any>) => unknown
}

const BlockHeader = ({title, subtitle, callback, ...rest}: BlockHeaderProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingHorizontal: spacing.m,
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
            },
            title: {
                fontSize: 24,
                color: palette.offwhite
            },
            subtitle: {
                textDecorationLine: 'underline',
                color: palette.offwhite
            }
        })
    }, []);

    return(
        <View style={[styles.wrapper, rest.style]}>
            <Text style={styles.title}>
                {title}
            </Text>
            <Text style={styles.subtitle} onPress={callback}>
                {subtitle}
            </Text>
        </View>
    )
}

export default BlockHeader