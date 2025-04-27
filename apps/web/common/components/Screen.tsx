import {SafeAreaView, StyleSheet, useWindowDimensions, View} from 'react-native'
import {WithChildren} from "@/common/types";
import MetaData from "@/common/components/MetaData";
import {palette, spacing} from "@/theme";
import {LinearGradient} from "expo-linear-gradient";

interface ScreenProps {

}

const Screen = ({children}: WithChildren) => {

    const { width, height } = useWindowDimensions()

    const styles = StyleSheet.create({
        wrapper : {
            flex: 1,
            paddingTop: spacing.l,
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: palette.darkgrey
        },
        gradient : {
            ...StyleSheet.absoluteFillObject
        },
        background: {
            width: '100vw', height: '100vh',
            ...StyleSheet.absoluteFillObject
        },
        content: {
            height: '100vh',
            overflow: 'auto'
        }
    })

    return(
        <SafeAreaView style={styles.wrapper}>
            <MetaData />

            <LinearGradient
                style={styles.gradient}
                colors={[palette.purple, '#130A0D', '#3a2316']}
            />

            <View style={styles.content}>
                {children}
            </View>
        </SafeAreaView>
    )
}

export default Screen