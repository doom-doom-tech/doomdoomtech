import {StyleSheet, Text, View} from 'react-native'
import {useMemo} from "react";
import Megaphone from "@/assets/icons/Megaphone"
import {palette, spacing} from "@/theme";

interface AdvertisementHeaderProps {

}

const AdvertisementHeader = ({}: AdvertisementHeaderProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                padding: spacing.m,
                flexDirection: 'row',
                gap: spacing.m,
                alignItems: 'center'
            },
            circle: {
                alignItems: 'center',
                justifyContent: 'center',
                width: 50, height: 50,
                borderRadius: 50,
                backgroundColor: palette.lightgrey,
            },
            title: {
                color: palette.offwhite,
                fontWeight: 700,
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <View style={styles.circle}>
                <Megaphone color={palette.black}/>
            </View>
            <Text style={styles.title}>
                Advertisement
            </Text>
        </View>
    )
}

export default AdvertisementHeader