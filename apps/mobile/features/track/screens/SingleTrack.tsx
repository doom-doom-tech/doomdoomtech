import {StyleSheet} from 'react-native'
import {Fragment, useMemo} from "react";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import SingleTrackMedia from "@/features/track/components/single-track/SingleTrackMedia";
import Screen from "@/common/components/Screen";
import SingleTrackHeader from "@/features/track/components/single-track/SingleTrackHeader";
import SingleTrackInformation from "@/features/track/components/single-track/SingleTrackInformation";
import {styling} from "@/theme";
import SingleTrackMetrics from "@/features/track/components/single-track/SingleTrackMetrics";
import {useLocalSearchParams} from "expo-router";
import useTrack from "@/features/track/hooks/useTrack";
import SingleTrackLoading from "@/features/track/screens/SingleTrackLoading";
import _ from "lodash";
import Scroll from "@/common/components/Scroll";
import TrackOptions from "@/features/track/sheets/TrackOptions";

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
            <TrackContextProvider track={trackQuery.data}>
                <SingleTrackHeader />
                <Scroll onRefresh={trackQuery.refetch} refreshing={trackQuery.isRefetching} contentContainerStyle={styles.container}>
                    <SingleTrackMedia />
                    <SingleTrackInformation />
                    <SingleTrackMetrics />
                </Scroll>
                <TrackOptions />
            </TrackContextProvider>
        </Screen>
    )
}

export default SingleTrack