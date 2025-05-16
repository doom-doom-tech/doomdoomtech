import {StyleSheet, TouchableOpacity, useWindowDimensions, View} from 'react-native'
import {useMemo} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import {palette} from "@/theme";
import Text from "@/common/components/Text";
import {router} from "expo-router";

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
            },
            artistContainer: {
                flexDirection: 'row',
                flexWrap: 'wrap'
            },
            artist: {
                color: palette.offwhite,
                opacity: 0.6
            },
            separator: {
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
            <View style={styles.artistContainer}>
                {track.getArtists().map((artist, index) => (
                    <View key={artist.getID()} style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={(event) => {
                                event.stopPropagation(); // Prevent event from bubbling up
                                router.push(`/user/${artist.getID()}`);
                            }}
                        >
                            <Text style={styles.artist}>
                                {artist.getUsername()}
                            </Text>
                        </TouchableOpacity>
                        {index < track.getArtists().length - 1 && (
                            <Text style={styles.separator}>, </Text>
                        )}
                    </View>
                ))}
            </View>
        </View>
    )
}

export default FeedTrackInformation