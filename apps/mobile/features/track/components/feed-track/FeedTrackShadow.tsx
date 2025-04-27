import {Dimensions, StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {LinearGradient} from "expo-linear-gradient";

interface FeedTrackShadowProps {

}

const { width: screenWidth } = Dimensions.get('window')

const FeedTrackShadow = ({}: FeedTrackShadowProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                width: screenWidth,
                height: screenWidth,
                position: 'absolute',
                bottom: 0
            },
            gradient: {
                opacity: 0.75,
                width: screenWidth,
                height: screenWidth,
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <LinearGradient colors={['#00000000', '#000000']} style={styles.gradient} />
        </View>
    )
}

export default FeedTrackShadow