import {StyleSheet, View} from 'react-native'
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";
import {Image} from "expo-image";
import Waveform from "@/assets/images/waveform.png"

interface ChartsTitleProps {

}

const ChartsTitle = ({}: ChartsTitleProps) => {

    const styles = StyleSheet.create({
        wrapper: {
            paddingVertical: 24
        },
        title: {
            fontSize: 32,
            fontFamily: 'SyneExtraBold',
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
            bottom: 24,
            width: '100%',
            height: 40
        }
    })

    return(
        <View style={styles.wrapper}>
            <Text style={styles.title}>
                Favorites
            </Text>
            <Text style={styles.subtitle}>
                Rate • Add • Support
            </Text>

            <Image
                source={Waveform}
                style={styles.waveform}
            />
        </View>
    )
}

export default ChartsTitle