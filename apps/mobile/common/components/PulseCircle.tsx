import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {useAnimatedStyle} from "react-native-reanimated";
import {palette} from "@/theme";
import offwhite from "@/assets/images/pulses/offwhite.png"
import {Image} from "expo-image";

interface PulseCircleProps {
    color: keyof typeof palette
}

const PulseCircle = ({}: PulseCircleProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: "absolute",
            },

        })
    }, []);

    const animatedImageStyle = useAnimatedStyle(() => ({
        position: 'absolute',
        top: 0,
        left: 0,
        width: 500,
        height: 500
    }))

    return(
        <View style={styles.wrapper}>
            <Image source={offwhite} style={animatedImageStyle} />
        </View>
    )
}

export default PulseCircle