import {ScrollView, StyleSheet, useWindowDimensions, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {useMandatoryRatingStoreSelectors} from "@/features/track/store/mandatory-rating";
import {Image} from "expo-image";
import _ from "lodash";
import TrackRate from "@/features/track/components/TrackRate";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import TrackInformation from "@/features/track/components/TrackInformation";
import {spacing} from "@/theme";
import TrackPlayButton from "@/features/track/components/TrackPlayButton";
import {router} from "expo-router";
import {wait} from "@/common/services/utilities";

interface MandatoryRatingTracksProps {

}

const MandatoryRatingTracks = ({}: MandatoryRatingTracksProps) => {

    const { width } = useWindowDimensions()

    const played = useMandatoryRatingStoreSelectors.played()
    const setMandatoryRatingState = useMandatoryRatingStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            item: {
                gap: spacing.m,
                width: width, height: 'auto',
                alignItems: 'center',
                justifyContent: 'center'
            },
            cover: {
                width: 200,
                height: 200,
            }
        })
    }, []);

    const handleCompleteRating = useCallback(async () => {
        router.back()
        await wait(200)
        setMandatoryRatingState({ played: [] })
    }, [])

    return(
        <View style={styles.wrapper}>
            <ScrollView horizontal pagingEnabled>
                { _.map(played, (track, index) => (
                    <TrackContextProvider track={track}>
                        <View style={styles.item}>
                            <Image source={track.getCoverSource()} style={styles.cover} />
                            <TrackInformation center />
                            <TrackRate onCompleteRating={handleCompleteRating} />
                            <TrackPlayButton />
                        </View>
                    </TrackContextProvider>
                ))}
            </ScrollView>
        </View>
    )
}

export default MandatoryRatingTracks