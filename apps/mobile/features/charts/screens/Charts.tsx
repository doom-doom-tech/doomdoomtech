import {DeviceEventEmitter, StyleSheet, useWindowDimensions, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import Screen from "@/common/components/Screen";
import {spacing} from "@/theme";
import {router, useFocusEffect} from "expo-router";
import Scroll from "@/common/components/Scroll";
import {wait} from "@/common/services/utilities";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ImageBackground} from "expo-image";
import ChartsBackground from "@/assets/images/charts.png"
import Text from "@/common/components/Text";
import ChartsHeader from "@/features/charts/components/ChartsHeader";
import ChartsTitle from "@/features/charts/components/ChartsTitle";
import NewArtists from "@/features/charts/components/NewArtists";
import LatestTracks from "@/features/charts/components/LatestTracks";
import LatestLabels from "@/features/charts/components/LatestLabels";
import BestRatedTracks from "@/features/charts/components/BestRatedTracks";
import MostListenedTracks from "@/features/charts/components/MostListenedTracks";
import MostPopularTracks from "@/features/charts/components/MostPopularTracks";
import LatestNotes from "@/features/charts/components/LatestNotes";
import LatestVideos from '../components/LatestVideos';

const Charts = () => {

    const { width } = useWindowDimensions()
    const { top } = useSafeAreaInsets()

    const userFilter = useFilterStoreSelectors.user()
    const genreFilter = useFilterStoreSelectors.genre()
    const subgenreFilter = useFilterStoreSelectors.subgenre()
    const setFilterState = useFilterStoreSelectors.setState()

    const [refetching, setRefetching] = useState<boolean>(false);

    const styles = StyleSheet.create({
        wrapper: {
            paddingHorizontal: spacing.m
        },
        title: {
            fontSize: 24,
            textAlign: 'center',
            fontWeight: 'bold'
        },
        header: {
            width,
            height: 300,
            paddingTop: top,
            marginTop: top * -1
        },
        container: {
            paddingBottom: 400,
            gap: 32
        },
        icons: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.m
        },
        background: {
            ...StyleSheet.absoluteFillObject,
            opacity: 0.25
        }
    })

    const handleRefetchCharts = useCallback(async () => {
        setRefetching(true);
        DeviceEventEmitter.emit('charts:refetch')

        await wait(2000)
        setRefetching(false);
    }, [])

    useFocusEffect(() => {
        setFilterState({
            user: undefined,
            genre: genreFilter,
            subgenre: subgenreFilter
        })
    })

    return(
        <Screen>
            <Scroll onRefresh={handleRefetchCharts} refreshing={refetching} style={styles.header} contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <ImageBackground source={ChartsBackground} style={styles.background} />
                    <ChartsHeader />
                    <ChartsTitle />
                </View>

                <LatestVideos />
                <LatestTracks />
                <NewArtists />
                <LatestLabels />
                <BestRatedTracks />
                <MostListenedTracks />
                <MostPopularTracks />
                <LatestNotes />
            </Scroll>
        </Screen>
    )
}

export default Charts