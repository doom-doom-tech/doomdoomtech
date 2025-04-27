import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {useMemo, useRef} from "react";
import LottieView from "lottie-react-native";
import Text from "@/common/components/Text";
import {palette} from "@/theme";

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

    return(
        <View style={styles.wrapper}>
            <LottieView
                ref={animationReference}
                autoPlay={true}
                loop={true}
                resizeMode={"cover"}
                style={{height: 150, width: 250}}
                source={require('@/assets/animations/personalizing.json')}
            />
            <Text style={styles.title}>
                Building your feed...
            </Text>
        </View>
    )
}

export default PersonalizeProgress