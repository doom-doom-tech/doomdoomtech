import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import {palette, spacing} from "@/theme";
import Subtitle from "@/common/components/Subtitle";
import Title from "@/common/components/Title";
import EqualizerAnimation from "@/common/components/EqualizerAnimation";

interface TrackInformationProps {
    center?: boolean
}

const TrackInformation = ({center}: TrackInformationProps) => {

    const track = useTrackContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            title: {
                position: 'relative',
                justifyContent: center ? 'center' : 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                textAlign: 'center',
                gap: spacing.s,
            },
            animation: {
                position: 'absolute',
                right: -24
            },
            artists: {
                color: palette.granite
            }
        })
    }, []);

    const artists = useMemo(() => {
        return track.getArtists().map(artist => artist.getUsername()).join(', ')
    }, [track])

    return(
        <View style={styles.wrapper}>
            <Title content={track.getTitle()} center={center} append={<EqualizerAnimation size={18} />} />
            <Subtitle content={artists} center={center} />
        </View>
    )
}

export default TrackInformation