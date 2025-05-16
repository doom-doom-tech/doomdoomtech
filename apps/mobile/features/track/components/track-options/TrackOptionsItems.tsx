import {useMemo, useState} from "react";
import {DeviceEventEmitter, StyleSheet, TouchableOpacity, View} from "react-native";
import HeartFilled from "@/assets/icons/HeartFilled";
import Heart from "@/assets/icons/Heart";
import UserCircle from "@/features/user/components/UserCircle";
import Note from "@/assets/icons/Note";
import Share from "@/assets/icons/Share";
import Trash from "@/assets/icons/Trash";
import {palette, spacing} from "@/theme";
import Text from "@/common/components/Text";
import _ from "lodash";
import useTrackActions from "@/features/track/hooks/useTrackActions";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import Track from "@/features/track/classes/Track";
import Queue from "@/assets/icons/Queue";
import FlameFilled from "@/assets/icons/FlameFilled";
import {useRatingQueueStoreSelectors} from "@/features/track/store/rating-queue";
import {router} from "expo-router";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import Flame from "@/assets/icons/Flame";
import Comments from "@/assets/icons/Comments";

interface Props {
    track: Track;
}

const TrackOptionsItems = ({track}: Props) => {

    const user = useGlobalUserContext();
    const { comments, saved, favorite, visitArtist, createNote, share, queue, remove } = useTrackActions(track as Track);

    const eligibleRatingTracks = useRatingQueueStoreSelectors.eligible()

    const currentRatingQueue = useRatingQueueStoreSelectors.current()

    const currentlyRatingActive = (track && currentRatingQueue)
        && currentRatingQueue.id === track.getID()

    const [rated, setRated] = useState<boolean>(track.liked())

    const triggerRating = () => {
        if(!user) router.push('/auth')
        if(track.liked()) return Toast.show('You already rated this track', TOASTCONFIG.warning)
        if (!eligibleRatingTracks.has(track.getID())) return Toast.show("Listen 10 seconds before you rate", TOASTCONFIG.warning)
        DeviceEventEmitter.emit('track:rate:start', track)
    }

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                padding: spacing.m,
            },
            item: {
                flexDirection: "row",
                gap: spacing.s,
                alignItems: "center",
                paddingVertical: spacing.s,
            },
            text: {
                color: palette.offwhite,
            },
            textDestructive: {
                color: palette.error,
            },
        });
    }, []);

    const actions = [
        {
            icon: saved ? <HeartFilled color={palette.olive} /> : <Heart />,
            label: saved ? "Remove from top picks" : "Add to top picks",
            callback: favorite,
        },
        ...track.getArtists().map((artist) => ({
            icon: <UserCircle size={24} source={artist.getImageSource()} />,
            label: artist.isLabel() ? `View label ${artist.getUsername()}` : `View artist ${artist.getUsername()}`,
            callback: visitArtist(artist),
        })),
        {
            icon: (rated || currentlyRatingActive || eligibleRatingTracks.has(track.getID())) ? <FlameFilled /> : <Flame />,
            label: `Rate track (${track.getLikesCount()})`,
            callback: triggerRating,
        },
        {
            icon: <Comments />,
            label: `View comments (${track.getCommentsCount()})`,
            callback: comments,
        },
        {
            icon: <Note />,
            label: "Add to a new note",
            callback: createNote,
        },
        {
            icon: <Share />,
            label: "Share this track",
            callback: share,
        },
        {
            icon: <Queue />,
            label: "Add to queue",
            callback: queue,
        },
        user?.getID() === track.getMainArtist().getID() && {
            icon: <Trash color={palette.error} />,
            label: "Delete track",
            callback: remove,
            destructive: true,
        },
    ]

    return (
        <View style={styles.wrapper}>
            {_.compact(actions).map((action, index) => (
                <TouchableOpacity
                    key={index}
                    activeOpacity={0.5}
                    onPress={action.callback}
                    style={styles.item}
                >
                    {action.icon}
                    <Text style={action.destructive ? styles.textDestructive : styles.text}>
                        {action.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default TrackOptionsItems;