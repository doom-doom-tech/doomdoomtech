import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {useMemo} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import {palette} from "@/theme";
import Text from "@/common/components/Text";

interface FeedTrackInformationProps {

}

const FeedTrackInformation = ({}: FeedTrackInformationProps) => {

    const track = useTrackContext()

    const { width } = useWindowDimensions()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'absolute',
                left: 16,
                bottom: 16
            },
            title: {
                color: palette.offwhite,
                fontWeight: 600,
                fontSize: 32,
                maxWidth: width - 100
            },
            artists: {
                color: palette.offwhite,
                opacity: 0.6
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <Text style={styles.title} numberOfLines={1}>
                {track.getTitle()}
            </Text>
            <Text style={styles.artists}>
                {track.getArtists().map(artist => artist.getUsername()).join(', ')}
            </Text>
        </View>
    )
}

export default FeedTrackInformation