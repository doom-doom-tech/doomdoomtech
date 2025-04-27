import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {useMemo} from "react";
import {palette} from "@/theme";

interface SubscriptionPresentationPaneProps {

}

const SubscriptionPresentationPane = ({}: SubscriptionPresentationPaneProps) => {

    const { width, height } = useWindowDimensions();

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'absolute',
                width: width,
                height: height / 2,
                backgroundColor: palette.black,
                borderTopRightRadius: 50,
                borderTopLeftRadius: 50,
            },
        })
    }, [width]);

    return(
        <View style={styles.wrapper}>

        </View>
    )
}

export default SubscriptionPresentationPane