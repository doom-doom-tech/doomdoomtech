import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo} from "react";
import ArrowRight from "@/assets/icons/ArrowRight";
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";
import {RelativePathString, router} from "expo-router";

interface NavigateTabProps {
    title: string
    subtitle: string
    href: string
}

const NavigateTab = ({title, subtitle, href}: NavigateTabProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                height: 80,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: spacing.m,
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderColor: palette.granite
            },
            left: {

            },
            right: {

            },
            title: {
                fontSize: 18,
                color: palette.offwhite
            },
            subtitle: {
                color: palette.granite
            }
        })
    }, []);

    const handleRouting = useCallback(() => {
        router.push(href as RelativePathString)
    }, [])

    return(
        <TouchableOpacity style={styles.wrapper} onPress={handleRouting}>
            <View style={styles.left}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            <View style={styles.right}>
                <ArrowRight />
            </View>
        </TouchableOpacity>
    )
}

export default NavigateTab