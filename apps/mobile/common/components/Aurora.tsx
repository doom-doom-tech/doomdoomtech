import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {useEffect, useMemo} from "react";
import Animated, {interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withTiming} from "react-native-reanimated";
import {BlurView} from "expo-blur";
import {LinearGradient} from "expo-linear-gradient";
import {palette} from "@/theme";

interface AuroraProps {

}

const Aurora = ({}: AuroraProps) => {

    const { height } = useWindowDimensions()


    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const blurviewStyle = StyleSheet.create({
        wrapper: {
            width: '100%',
            height: '100%'
        }
    })

    const color = useSharedValue(0)
    const translate = useSharedValue(-100)
    const altitude = useSharedValue(-300)

    const firstAnimatedCircleStyle = useAnimatedStyle(() => ({
        width: 600,
        height: 600,
        borderRadius: 500,
        position: 'absolute',
        top: altitude.value,
        left: translate.value,
        backgroundColor: interpolateColor(
            color.value,
            [0, 1],
            [palette.gold, palette.black]
        ),
    }))

    useEffect(() => {
        altitude.value = withRepeat(withTiming(0, { duration: 3000 }), -1, true)
        color.value = withRepeat(withTiming(1, { duration: 3000 }), -1, true)
    }, [])

    return(
        <View style={{ position: 'absolute', top: -100, width: '100%', opacity: 0.5 }}>
            <View style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
                <Animated.View style={firstAnimatedCircleStyle} />
                <BlurView style={blurviewStyle.wrapper} intensity={100}>
                    <LinearGradient
                        colors={['#00000095', '#000000']}
                        style={{ width: '100%', height: height,}}
                    />
                </BlurView>
            </View>
        </View>
    )
}

export default Aurora