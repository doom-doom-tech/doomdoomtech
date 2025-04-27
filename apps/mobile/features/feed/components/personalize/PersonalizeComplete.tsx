import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {useCallback, useMemo, useRef} from "react";
import LottieView from "lottie-react-native";
import Text from "@/common/components/Text";
import {palette} from "@/theme";
import CheckCircle from "@/assets/icons/CheckCircle";
import {router} from "expo-router";

interface PersonalizeProgressProps {

}

const PersonalizeProgress = ({}: PersonalizeProgressProps) => {

    const { height } = useWindowDimensions()

    const animationReference = useRef<LottieView>(null)

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                height: height,
                justifyContent: 'center',
                alignItems: 'center',
            },
            title: {
                fontSize: 24,
                textAlign: 'center',
                color: palette.offwhite,
                fontWeight: 'bold'
            },
        })
    }, []);

    const handleClose = useCallback(() => {
        router.back()
    }, [])

    return(
        <View style={styles.wrapper}>
            <CheckCircle width={100} height={100} color={palette.olive} />
            <Text style={styles.title}>
                Your feed will be personalized within 24 hours
            </Text>
        </View>
    )
}

export default PersonalizeProgress