import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import BottomNavigation from "@/common/components/tab-bar/BottomNavigation";
import BottomPlayer from "@/common/components/tab-bar/bottom-player/BottomPlayer";

interface BottomTabBarProps {

}

const BottomTabBar = ({}: BottomTabBarProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'absolute',
                backgroundColor: 'transparent',
                bottom: 0,
                width: '100%',
                zIndex: 1
            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <BottomPlayer />
            <BottomNavigation />
        </View>
    )
}

export default BottomTabBar
