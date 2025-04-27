import {DeviceEventEmitter, StyleSheet, useWindowDimensions, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import {palette, spacing, styling} from "@/theme";
import IconButton from "@/common/components/buttons/IconButton";
import {useMediaStoreSelectors} from "@/common/store/media";
import TrackPlayButton from "@/features/track/components/TrackPlayButton";
import Flame from "@/assets/icons/Flame";
import Track from "@/features/track/classes/Track";
import useEventListener from "@/common/hooks/useEventListener";
import FlameFilled from "@/assets/icons/FlameFilled";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import Text from "@/common/components/Text";

interface SingleTrackInformationProps {

}

const SingleTrackInformation = ({}: SingleTrackInformationProps) => {

    const track = useTrackContext()

    const { width } = useWindowDimensions()

    const [liked, setLiked] = useState<boolean>(track.liked())
    const [likes, setLikes] = useState<number>(track.getLikesCount())

    const setMediaState = useMediaStoreSelectors.setState()

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
                fontSize: 18,
            },
            artists: {
                color: palette.granite,
            }
        })
    }, []);

    const artists = useMemo(() => {
        return track.getArtists().map(artist => artist.getUsername()).join(', ')
    }, [])

    const triggerRating = useCallback(() => {
        if(track.liked()) return Toast.show('You already rated this track', TOASTCONFIG.warning)
        DeviceEventEmitter.emit('track:rate:trigger', track)
    }, [track])

    const handleLoadTrack = useCallback(() => {
        setMediaState({ current: track })
    }, [])

    const handleIncrementLikes = useCallback((t: Track, amount: number) => {
        if(track.getID() === t.getID()) {
            setLiked(true)
            setLikes(previous => previous + amount)
        }
    }, [])

    useEventListener('track:likes:increase', handleIncrementLikes)

    return(
        <View style={styles.wrapper}>
            <View>
                <Text style={styles.title}>
                    {track.getTitle()}
                </Text>
                <Text style={styles.artists}>
                    {artists}
                </Text>
            </View>
            <View style={styling.row.s}>
                <IconButton
                    fill={'black'}
                    icon={liked ? <FlameFilled /> : <Flame />}
                    callback={triggerRating}
                />

                <TrackPlayButton />
            </View>
        </View>
    )
}

export default SingleTrackInformation