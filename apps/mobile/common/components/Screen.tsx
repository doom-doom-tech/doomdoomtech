import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {LinearGradient} from 'expo-linear-gradient';
import {palette} from "@/theme";
import {WithChildren} from "@/common/types/common";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface ScreenProps extends WithChildren {

}

const Screen = ({children}: ScreenProps) => {

    const { top } = useSafeAreaInsets()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
                paddingTop: top
            },
            background: StyleSheet.absoluteFillObject
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <LinearGradient style={styles.background} colors={[palette.purple, '#2D130F']} />
            {children}
        </View>
    )
}

export default Screen