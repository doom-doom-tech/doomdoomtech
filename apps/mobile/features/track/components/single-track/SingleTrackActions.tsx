import {Alert, DeviceEventEmitter, StyleSheet, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import {palette, spacing} from "@/theme";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import UserCircle from "@/features/user/components/UserCircle";
import Note from "@/assets/icons/Note";
import Mic from "@/assets/icons/Mic";
import Send from "@/assets/icons/Send";
import User from "@/features/user/classes/User";
import {router} from "expo-router";
import useListSaveTrack from "@/features/list/hooks/useListSaveTrack";
import useListRemoveTrack from "@/features/list/hooks/useListRemoveTrack";
import useEventListener from "@/common/hooks/useEventListener";
import {useCreateNoteStoreSelectors} from "@/features/note/store/create-note";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import Genre from "@/features/genre/classes/Genre";
import Headphones from "@/assets/icons/Headphones";
import TrackPlayer from "react-native-track-player";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import {useQueueStoreSelectors} from "@/common/store/queue";
import _ from 'lodash';
import {useShareStoreSelectors} from "@/features/share/store/share";
import Trash from "@/assets/icons/Trash";
import Text from "@/common/components/Text";
import useTrackDelete from "@/features/track/hooks/useTrackDelete";
import {formatServerErrorResponse, wait} from "@/common/services/utilities";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import {useAlgoliaEvents} from "@/common/hooks/useAlgoliaEvents";
import HeartFilled from "@/assets/icons/HeartFilled";
import Heart from "@/assets/icons/Heart";

interface SingleTrackActionsProps {

}

const SingleTrackActions = ({}: SingleTrackActionsProps) => {

    const track = useTrackContext()

    const { shareTrack, saveToTopPicks } = useAlgoliaEvents()

    const currentUser = useGlobalUserContext()

    const addQueueTrack = useQueueStoreSelectors.addTrack()
    const setFilterState = useFilterStoreSelectors.setState()
    const setShareState = useShareStoreSelectors.setState()
    const setCreateNoteState = useCreateNoteStoreSelectors.setState()

    const [saved, setSaved] = useState<boolean>(track.saved())

    const saveTrackMutation = useListSaveTrack()
    const removeTrackMutation = useListRemoveTrack()

    const deleteTrackMutation = useTrackDelete()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                padding: spacing.m
            },
            item: {
                flexDirection: 'row',
                gap: spacing.s,
                alignItems: 'center',
                paddingVertical: spacing.s
            },
            text: {
                color: palette.offwhite
            },
            textDestructive: {
                color: palette.error
            }
        })
    }, []);

    const handleAddToTopPicks = useCallback(async () => {
        DeviceEventEmitter.emit('sheet:close', { name: 'TrackOptions' })
        await wait(200)

        if(saved) {
            setSaved(false)
            return removeTrackMutation.mutate({ trackID: track.getID() })
        }

        saveTrackMutation.mutate({ trackID: track.getID() })
        saveToTopPicks(track.getID())
    }, [saved])

    const handleRouteArtist = useCallback((artist: User) => async () =>  {
        DeviceEventEmitter.emit('sheet:close', { name: 'TrackOptions' })
        await wait(200)
        router.push(`/user/${artist.getID()}`)
    }, [])

    const catchSaveTrackEvent = useCallback(async (trackID: number) => {
        if(trackID === track.getID()) setSaved(true)
    }, [track])

    const catchRemoveTrackEvent = useCallback((trackID: number) => {
        if(trackID === track.getID()) setSaved(false)
    }, [track])

    const handleCreateNote = useCallback(async () => {
        DeviceEventEmitter.emit('sheet:close', { name: 'TrackOptions' })
        await wait(200)
        setCreateNoteState({ track })
        router.push('/create-note')
    }, [track])

    const handleShareTrack = useCallback(async () => {
        DeviceEventEmitter.emit('sheet:close', { name: 'TrackOptions' })
        await wait(200)
        shareTrack(track.getID())
        setShareState({ entity: track })
        router.push('/share')
    }, [track])

    const handleBrowseGenre = useCallback(async () => {
        DeviceEventEmitter.emit('sheet:close', { name: 'TrackOptions' })
        await wait(200)
        setFilterState({ genre: new Genre(track.getGenre()) })
        router.push('/charts')
    }, [])

    const handleAddToQueue = useCallback(async () => {
        DeviceEventEmitter.emit('sheet:close', { name: 'TrackOptions' })
        await wait(200)

        await TrackPlayer.add([{
            title: track.getTitle(),
            artwork: track.getCoverSource() || 'https://play-lh.googleusercontent.com/Cg5EcFiy1xg6VIt_Q2gnp8rvRjVM-r7Pz2Zvw6aCPYD-wsky8RuEU58t58ktA4HAvj8',
            url: track.getAudioSource() as string,
            artist: _.map(track.getArtists(), artist => artist.getUsername()).join(', '),
        }])

        addQueueTrack(track)

        Toast.show('Added to queue', TOASTCONFIG.success)
    }, [])

    const handleDeleteTrack = useCallback(async () => {
        try {
            Alert.alert("Delete track", "Are you sure you want to delete this track and every related note?", [
                {
                    text: 'Cancel',
                    onPress: _.noop,
                    style: 'cancel',
                },
                {
                    text: "Delete",
                    style: 'destructive',
                    onPress: async () => {
                        await deleteTrackMutation.mutateAsync({
                            trackID: track.getID()
                        })

                        await router.back()
                        await wait(200)
                        Toast.show('Track deleted', TOASTCONFIG.success)
                    }
                }
            ])
        } catch (error: any) {
            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error)
        }
    }, [])

    useEventListener('track:save', catchSaveTrackEvent)
    useEventListener('track:remove', catchRemoveTrackEvent)

    const actions = useMemo(() => ([
        {
            icon: saved ? <HeartFilled color={palette.olive} /> : <Heart />,
            label: saved ? "Remove from top picks" : "Add to top picks",
            callback: handleAddToTopPicks
        },
        ...track.getArtists().map(artist => ({
            icon: <UserCircle size={24} source={artist.getImageSource()} />,
            label: `View artist ${artist.getUsername()}`,
            callback: handleRouteArtist(artist)
        })),
        {
            icon: <Note />,
            label: "Add to a new note",
            callback: handleCreateNote
        },
        {
            icon: <Mic />,
            label: `View genre ${track.getGenre().name}`,
            callback: handleBrowseGenre
        },
        {
            icon: <Send />,
            label: "Share this track",
            callback: handleShareTrack
        },
        {
            icon: <Headphones />,
            label: "Add to queue",
            callback: handleAddToQueue
        },
        (currentUser?.getID() === track.getMainArtist().getID()) && {
            icon: <Trash color={palette.error} />,
            label: "Delete track",
            callback: handleDeleteTrack,
            destructive: true
        },
    ]), [saved, handleAddToTopPicks])

    return(
        <View style={styles.wrapper}>
            { _.compact(actions).map((action, __) => (
                <TouchableOpacity activeOpacity={0.5} onPress={action.callback} style={styles.item}>
                    {action.icon}
                    <Text style={action.destructive ? styles.textDestructive : styles.text}>{action.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

export default SingleTrackActions