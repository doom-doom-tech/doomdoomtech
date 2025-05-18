import {StyleSheet} from 'react-native'
import {Fragment, useMemo} from "react";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import SingleTrackMedia from "@/features/track/components/single-track/SingleTrackMedia";
import Screen from "@/common/components/Screen";
import SingleTrackHeader from "@/features/track/components/single-track/SingleTrackHeader";
import SingleTrackInformation from "@/features/track/components/single-track/SingleTrackInformation";
import {styling} from "@/theme";
import {useLocalSearchParams} from "expo-router";
import useTrack from "@/features/track/hooks/useTrack";
import SingleTrackLoading from "@/features/track/screens/SingleTrackLoading";
import _ from "lodash";
import Scroll from "@/common/components/Scroll";
import NowPlayingMetrics from "@/features/track/components/now-playing/NowPlayingMetrics";
import SingleTrackMoreFromArtist from "@/features/track/components/single-track/SingleTrackMoreFromArtist";
import Queueable from "@/common/components/Queueable";
import {convertToQueryResult} from "@/common/services/utilities";


const SingleTrack = () => {

    const { id } = useLocalSearchParams()

    const trackQuery = useTrack({ trackID: Number(id as string) })

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            container: {
                ...styling.column.m,
                paddingBottom: 400
            }
        })
    }, []);

    if(trackQuery.isLoading) return <SingleTrackLoading />
    if(trackQuery.isError || _.isUndefined(trackQuery.data)) return <Fragment />

    return(
        <Screen>
            <Queueable query={convertToQueryResult([trackQuery.data])}>
                <TrackContextProvider track={trackQuery.data}>
                    <SingleTrackHeader />
                    <Scroll onRefresh={trackQuery.refetch} refreshing={trackQuery.isRefetching} contentContainerStyle={styles.container}>
                        <SingleTrackMedia />
                        <SingleTrackInformation />
                        <NowPlayingMetrics />
                        <SingleTrackMoreFromArtist />
                    </Scroll>
                </TrackContextProvider>
            </Queueable>
        </Screen>
    )
}

export default SingleTrack