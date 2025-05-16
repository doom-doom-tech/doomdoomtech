import {DeviceEventEmitter, StyleSheet, useWindowDimensions, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import {palette, spacing, styling} from "@/theme";
import {useMediaStoreSelectors} from "@/common/store/media";
import TrackPlayButton from "@/features/track/components/TrackPlayButton";
import Track from "@/features/track/classes/Track";
import useEventListener from "@/common/hooks/useEventListener";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import Text from "@/common/components/Text";
import User from '@/features/user/classes/User';
import {router} from "expo-router";
import {useRatingQueueStoreSelectors} from "@/features/track/store/rating-queue";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import TopPicksTrigger from "@/features/list/components/TopPicksTrigger";

interface SingleTrackInformationProps {

}

const SingleTrackInformation = ({}: SingleTrackInformationProps) => {

    const user = useGlobalUserContext()
    const track = useTrackContext()

    const { width } = useWindowDimensions()

    const [liked, setLiked] = useState<boolean>(track.liked())
    const [likes, setLikes] = useState<number>(track.getLikesCount())

    const setMediaState = useMediaStoreSelectors.setState()
    const eligibleRatingTracks = useRatingQueueStoreSelectors.eligible()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: spacing.m,
                alignItems: 'center'
            },
            title: {
                color: palette.offwhite,
                fontWeight: 600,
                maxWidth: width * 0.6,
                fontSize: 24,
            },
            artists: {
                color: palette.granite,
            }
        })
    }, []);

    const triggerRating = () => {
        if(!user) router.push('/auth')
        if(track.liked()) return Toast.show('You already rated this track', TOASTCONFIG.warning)
        if (!eligibleRatingTracks.has(track.getID())) return Toast.show("Listen 10 seconds before you rate", TOASTCONFIG.warning)
        DeviceEventEmitter.emit('track:rate:start', track)
    }

    const handleIncrementLikes = useCallback((t: Track, amount: number) => {
        if(track.getID() === t.getID()) {
            setLiked(true)
            setLikes(previous => previous + amount)
        }
    }, [])

    useEventListener('track:rate:complete', handleIncrementLikes)

    const routeArtist = (artist: User) => () => {
        router.push(`/user/${artist.getID()}`)
    }

    return(
        <View style={styles.wrapper}>
            <View>
                <Text style={styles.title}>
                    {track.getTitle()}
                </Text>
                <Text style={styles.artists}>
                    {track.getArtists().map((artist, index) => (
                        <Text onPress={routeArtist(artist)}>
                            {artist.getUsername()}
                            { track.getArtists().length > 1 && index <= track.getArtists().length - 2 && ', ' }
                        </Text>
                    ))}
                </Text>
            </View>
            <View style={styling.row.l}>
                <TopPicksTrigger />
                <TrackPlayButton />
            </View>
        </View>
    )
}

export default SingleTrackInformation