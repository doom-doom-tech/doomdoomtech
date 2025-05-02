import {DeviceEventEmitter, StyleSheet, useWindowDimensions, View} from 'react-native'
import React, {useCallback, useEffect, useState} from "react";
import Screen from "@/common/components/Screen";
import {spacing} from "@/theme";
import {useFocusEffect} from "expo-router";
import Scroll from "@/common/components/Scroll";
import {wait} from "@/common/services/utilities";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ImageBackground} from "expo-image";
import ChartsBackground from "@/assets/images/charts.png"
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
import Loading from "@/common/screens/Loading";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";

const Charts = () => {

    const { width } = useWindowDimensions()
    const { top } = useSafeAreaInsets()

    const userFilter = useFilterStoreSelectors.user()
    const genreFilter = useFilterStoreSelectors.genre()
    const subgenreFilter = useFilterStoreSelectors.subgenre()
    const setFilterState = useFilterStoreSelectors.setState()
    const period = useFilterStoreSelectors.period()
    const tag = useFilterStoreSelectors.label()

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
            height: 250,
            paddingTop: top,
            marginTop: top * -1
        },
        container: {
            gap: 32,
            paddingBottom: 400
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

    const [loading, setLoading] = useState<boolean>(true)

    const opacity = useSharedValue(0)

    useEffect(() => {
        setTimeout(() => setLoading(false), 3000)
    }, []);

    const animatedContentStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        gap: 32
    }))

    useEffect(() => {
        opacity.value = withTiming(loading ? 0 : 1)
    }, [loading]);

    return(
        <Screen>
            <Scroll onRefresh={handleRefetchCharts} refreshing={refetching} style={styles.header} contentContainerStyle={styles.container}>
                <>
                    <View style={styles.header}>
                        <ImageBackground source={ChartsBackground} style={styles.background} />
                        <ChartsHeader />
                        <ChartsTitle />
                    </View>

                    { loading && <Loading />}

                    <Animated.View style={animatedContentStyle}>
                        <LatestVideos />
                        <LatestTracks />
                        <NewArtists />
                        <LatestLabels />
                        <BestRatedTracks />
                        <MostListenedTracks />
                        <MostPopularTracks />
                        <LatestNotes />
                    </Animated.View>
                </>
            </Scroll>
        </Screen>
    )
}

export default Charts
