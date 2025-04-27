import {Pressable, StyleSheet, View} from 'react-native'
import Text from "@/common/components/Text";
import ArrowRight from "@/assets/icons/ArrowRight";
import {palette, spacing} from "@/theme";
import {Fragment, useMemo} from "react";
import Outbound from "@/assets/icons/Outbound";

type Icon = 'Internal' | 'Outbound' | 'None'

interface NavigationTabProps {
    title: string
    subtitle: string
    icon: Icon
    callback: (...args: Array<any>) => unknown
}

const NavigationTab = ({title, subtitle, callback, icon = 'None'}: NavigationTabProps) => {

    const styles = StyleSheet.create({
        wrapper: {
            paddingVertical: spacing.m,
            paddingHorizontal: spacing.s,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderColor: palette.offwhite + '20'
        },
        content: {
            display: 'flex',
            gap: 4,
        },
        title: {
            fontSize: 18,
            color: palette.offwhite
        },
        subtitle: {
            opacity: 0.5,
            color: palette.granite
        }
    })

    const IconComponent = useMemo(() => {
        switch(icon) {
            case "Internal": return <ArrowRight />
            case "Outbound": return <Outbound />
            case "None": return <Fragment />
        }
    }, [icon])

    return(
        <Pressable onPress={callback} style={styles.wrapper}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    {title}
                </Text>

                { subtitle && (
                    <Text style={styles.subtitle}>
                        {subtitle}
                    </Text>
                )}
            </View>
            { IconComponent }
        </Pressable>
    )
}

export default NavigationTab