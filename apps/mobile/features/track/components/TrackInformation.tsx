import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import {palette, spacing} from "@/theme";
import Title from "@/common/components/Title";
import EqualizerAnimation from "@/common/components/EqualizerAnimation";
import User from '@/features/user/classes/User';
import {router} from "expo-router";
import Subtitle from "@/common/components/Subtitle";

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
            },
            subtitle: {
                fontSize: 12,
                color: palette.granite,
                textAlign: center ? 'center' : 'left'
            }
        })
    }, []);

    const artists = useMemo(() => {
        return track.getArtists().map(artist => artist.getUsername()).join(', ')
    }, [track])

    const handleRouteArtist = useCallback((artist: User) => () => {
        router.push(`/user/${artist.getID()}`)
    }, [])

    return(
        <View style={styles.wrapper}>
            <Title content={track.getTitle()} center={center} append={<EqualizerAnimation size={18} />} />
            <Subtitle content={artists} center={center} />
        </View>
    )
}

export default TrackInformation