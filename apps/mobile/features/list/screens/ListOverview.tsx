import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {useMemo} from "react";
import Screen from "@/common/components/Screen";
import TopPicksHeader from "@/features/list/components/TopPicksHeader";
import TopPicksTracks from "@/features/list/components/TopPicksTracks";
import {ImageBackground} from "expo-image";
import TopPicksBackground from "@/assets/images/top-picks.png";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import TopPicksTitle from "@/features/list/components/TopPicksTitle";

interface ListOverviewProps {

}

const ListOverview = ({}: ListOverviewProps) => {

    const { width, height } = useWindowDimensions()
    const { top } = useSafeAreaInsets()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            header: {
                width,
                height: height * 0.25,
                paddingTop: top,
                marginTop: top * -1
            },
            background: {
                ...StyleSheet.absoluteFillObject,
                opacity: 0.25
            }
        })
    }, [width, top]);

    return(
        <Screen>
            <View style={styles.header}>
                <ImageBackground source={TopPicksBackground} style={styles.background} />
                <TopPicksHeader />
                <TopPicksTitle />
            </View>
            <TopPicksTracks />
        </Screen>
    )
}

export default ListOverview