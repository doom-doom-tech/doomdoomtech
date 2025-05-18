import {DeviceEventEmitter, StyleSheet, useWindowDimensions, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Screen from "@/common/components/Screen";
import TopPicksHeader from "@/features/list/components/TopPicksHeader";
import TopPicksTracks from "@/features/list/components/TopPicksTracks";
import {ImageBackground} from "expo-image";
import TopPicksBackground from "@/assets/images/top-picks.png";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import TopPicksTitle from "@/features/list/components/TopPicksTitle";
import {useFocusEffect} from "expo-router";
import {useQueryClient} from "@tanstack/react-query";
import TopPicksSearchbar from '../components/TopPicksSearchbar';
import { spacing } from '@/theme';

interface ListOverviewProps {

}

const ListOverview = ({}: ListOverviewProps) => {

    const queryClient = useQueryClient()

    const { width, height } = useWindowDimensions()
    const { top } = useSafeAreaInsets()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
                gap: spacing.m,
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

    const initializeListCount = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['list', 'count'] })
        DeviceEventEmitter.emit('list:count:reset')
    }, [])

    useFocusEffect(initializeListCount)

    return(
        <Screen>
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <ImageBackground source={TopPicksBackground} style={styles.background} />
                    <TopPicksHeader />
                    <TopPicksTitle />
                </View>
                <TopPicksSearchbar />
                <TopPicksTracks />
            </View>
        </Screen>
    )
}

export default ListOverview