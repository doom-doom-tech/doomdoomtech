import { View, StyleSheet } from 'react-native'
import {useMemo} from "react";
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";
import {Image} from "expo-image";
import Waveform from "@/assets/images/waveform.png"

interface ChartsTitleProps {

}

const ChartsTitle = ({}: ChartsTitleProps) => {

    const styles = StyleSheet.create({
        wrapper: {
            paddingVertical: 50
        },
        title: {
            fontSize: 32,
            fontWeight: 900,
            color: palette.offwhite,
            paddingLeft: spacing.m,
        },
        subtitle: {
            fontSize: 18,
            opacity: 0.6,
            fontWeight: 400,
            color: palette.offwhite,
            paddingLeft: spacing.m,
        },
        waveform: {
            position: 'absolute',
            bottom: 50,
            width: '100%',
            height: 40
        }
    })

    return(
        <View style={styles.wrapper}>
            <Text style={styles.title}>
                Charts
            </Text>
            <Text style={styles.subtitle}>
                Explore • Admire • Get Rated
            </Text>

            <Image
                source={Waveform}
                style={styles.waveform}
            />
        </View>
    )
}

export default ChartsTitle