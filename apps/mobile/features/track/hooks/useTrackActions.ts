import {useCallback, useEffect, useState} from "react";
import {Alert, DeviceEventEmitter} from "react-native";
import {router} from "expo-router";
import _ from "lodash";
import TrackPlayer from "react-native-track-player";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import {useQueueStoreSelectors} from "@/common/store/queue";
import {useShareStoreSelectors} from "@/features/share/store/share";
import {useCreateNoteStoreSelectors} from "@/features/note/store/create-note";
import useListSaveTrack from "@/features/list/hooks/useListSaveTrack";
import useListRemoveTrack from "@/features/list/hooks/useListRemoveTrack";
import useTrackDelete from "@/features/track/hooks/useTrackDelete";
import {useAlgoliaEvents} from "@/common/hooks/useAlgoliaEvents";
import useEventListener from "@/common/hooks/useEventListener";
import {formatServerErrorResponse, wait} from "@/common/services/utilities";
import User from "@/features/user/classes/User";
import Track from "@/features/track/classes/Track";

const useTrackActions = (track: Track | null) => {

    const { shareTrack, saveToTopPicks } = useAlgoliaEvents();
    const addQueueTrack = useQueueStoreSelectors.addTrack();
    const setShareState = useShareStoreSelectors.setState();
    const setCreateNoteState = useCreateNoteStoreSelectors.setState();
    const saveTrackMutation = useListSaveTrack();
    const removeTrackMutation = useListRemoveTrack();
    const deleteTrackMutation = useTrackDelete();

    const [saved, setSaved] = useState<boolean>(track ? track.saved() : false);

    useEffect(() => {
        setSaved(track ? track.saved() : false);
    }, [track]);

    const closeSheetAndWait = useCallback(async () => {
        DeviceEventEmitter.emit("sheet:close", { name: "TrackOptions" });
        await wait(200);
    }, []);

    const comments = useCallback(async () => {
        if (!track) return;
        await closeSheetAndWait();
        router.canDismiss() && router.dismiss();
        router.push(`/(sheets)/comments/Track/${track.getID()}`);
    }, [track, closeSheetAndWait]);

    const favorite = useCallback(async () => {
        if (!track) return;
        await closeSheetAndWait();
        if (saved) {
            setSaved(false);
            removeTrackMutation.mutate({ trackID: track.getID() });
        } else {
            setSaved(true);
            saveTrackMutation.mutate({ trackID: track.getID() });
            saveToTopPicks(track.getID());
        }
    }, [track, saved, saveTrackMutation, removeTrackMutation, saveToTopPicks, closeSheetAndWait]);

    const visitArtist = useCallback(
        (artist: User) => async () => {
            await closeSheetAndWait();
            router.push(`/user/${artist.getID()}`);
        },
        [closeSheetAndWait]
    );

    const createNote = useCallback(async () => {
        if (!track) return;
        await closeSheetAndWait();
        setCreateNoteState({ track });
        router.push("/create-note");
    }, [track, setCreateNoteState, closeSheetAndWait]);

    const share = useCallback(async () => {
        if (!track) return;
        await closeSheetAndWait();
        router.canDismiss() && router.dismiss();
        shareTrack(track.getID());
        setShareState({ entity: track });
        router.push("/share");
    }, [track, shareTrack, setShareState, closeSheetAndWait]);

    const queue = useCallback(async () => {
        if (!track) return;
        await closeSheetAndWait();
        try {
            await TrackPlayer.add([
                {
                    title: track.getTitle(),
                    artwork:
                        track.getCoverSource() ||
                        "https://play-lh.googleusercontent.com/Cg5EcFiy1xg6VIt_Q2gnp8rvRjVM-r7Pz2Zvw6aCPYD-wsky8RuEU58t58ktA4HAvj8",
                    url: track.getAudioSource() as string,
                    artist: _.map(track.getArtists(), (artist) => artist.getUsername()).join(", "),
                },
            ]);
            addQueueTrack(track);
            Toast.show("Added to queue", TOASTCONFIG.success);
        } catch (error) {
            Toast.show("Failed to add to queue", TOASTCONFIG.error);
        }
    }, [track, addQueueTrack, closeSheetAndWait]);

    const note = useCallback(async () => {
        if (!track) return;
        setCreateNoteState({ track });
        await closeSheetAndWait();
        router.canDismiss() && router.dismiss();
        router.push(`/(sheets)/create-note`);
    }, [track, setCreateNoteState, closeSheetAndWait]);

    const remove = useCallback(async () => {
        if (!track) return;
        Alert.alert(
            "Delete track",
            "Are you sure you want to delete this track and every related note?",
            [
                { text: "Cancel", onPress: _.noop, style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteTrackMutation.mutateAsync({ trackID: track.getID() });
                            await router.back();
                            await wait(200);
                            Toast.show("Track deleted", TOASTCONFIG.success);
                        } catch (error: any) {
                            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error);
                        }
                    },
                },
            ]
        );
    }, [track, deleteTrackMutation]);

    const catchSaveTrackEvent = useCallback(
        (trackID: number) => {
            if (track && trackID === track.getID()) setSaved(true);
        },
        [track]
    );

    const catchRemoveTrackEvent = useCallback(
        (trackID: number) => {
            if (track && trackID === track.getID()) setSaved(false);
        },
        [track]
    );

    useEventListener("list:track:save", catchSaveTrackEvent);
    useEventListener("list:track:remove", catchRemoveTrackEvent);

    return {
        note,
        comments,
        saved,
        favorite,
        visitArtist,
        createNote,
        share,
        queue,
        remove,
    };
};

export default useTrackActions;