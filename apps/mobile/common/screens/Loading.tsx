import {View, StyleSheet, useWindowDimensions} from 'react-native'
import {useMemo, useRef} from "react";
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import LottieView from "lottie-react-native";

interface LoadingProps {

}

const Loading = ({}: LoadingProps) => {

    const { width, height } = useWindowDimensions()

    const animationReference = useRef<LottieView>(null)

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
                width: width,
                height: height,
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center'
            },
            animation: {

            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <LottieView
                ref={animationReference}
                autoPlay={true}
                loop={true}
                resizeMode={"cover"}
                style={{height: 100, width: 100}}
                source={require('@/assets/animations/loading.json')}
            />
        </View>
    )
}

export default Loading