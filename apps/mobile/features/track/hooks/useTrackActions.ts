import { useEffect, useState } from "react";
import { Alert, DeviceEventEmitter } from "react-native";
import { router } from "expo-router";
import _, { before } from "lodash";
import TrackPlayer from "react-native-track-player";
import Toast from "react-native-root-toast";
import { TOASTCONFIG } from "@/common/constants";
import { useQueueStoreSelectors } from "@/common/store/queue";
import { useShareStoreSelectors } from "@/features/share/store/share";
import { useCreateNoteStoreSelectors } from "@/features/note/store/create-note";
import useListSaveTrack from "@/features/list/hooks/useListSaveTrack";
import useListRemoveTrack from "@/features/list/hooks/useListRemoveTrack";
import useTrackDelete from "@/features/track/hooks/useTrackDelete";
import { useAlgoliaEvents } from "@/common/hooks/useAlgoliaEvents";
import useEventListener from "@/common/hooks/useEventListener";
import { formatServerErrorResponse, wait } from "@/common/services/utilities";
import User from "@/features/user/classes/User";
import Track from "@/features/track/classes/Track";
import { useRoutingStoreSelectors } from "@/common/store/routing";

const useTrackActions = (track: Track | null) => {

    const { shareTrack, saveToTopPicks } = useAlgoliaEvents();
    const addQueueTrack = useQueueStoreSelectors.addTrack();
    const setShareState = useShareStoreSelectors.setState();
    const setCreateNoteState = useCreateNoteStoreSelectors.setState();
    const saveTrackMutation = useListSaveTrack();
    const removeTrackMutation = useListRemoveTrack();
    const deleteTrackMutation = useTrackDelete();

    const isModal = useRoutingStoreSelectors.isModal();
    const setModalState = useRoutingStoreSelectors.setState();

    const handleRouting = (path: string) => {
        if (isModal) router.back();

        setModalState({ isModal: false });

        DeviceEventEmitter.emit("sheet:close", { name: "TrackOptions" });
        DeviceEventEmitter.emit("sheet:close", { name: "NowPlaying" });

        router.push(path as any);
    };

    const [saved, setSaved] = useState<boolean>(track ? track.isAdded() : false);

    useEffect(() => {
        setSaved(track ? track.isAdded() : false);
    }, [track]);

    const comments = async () => {
        if (!track) return;
        handleRouting(`/(sheets)/comments/Track/${track.getID()}`);
    };

    const favorite = async () => {
        if (!track) return;
        if (saved) {
            setSaved(false);
            removeTrackMutation.mutate({ trackID: track.getID() });
        } else {
            setSaved(true);
            saveTrackMutation.mutate({ trackID: track.getID() });
            saveToTopPicks(track.getID());
        }
    };

    const visitArtist = (artist: User) => async () => {
        handleRouting(`/user/${artist.getID()}`);
    };

    const createNote = async () => {
        if (!track) return;
        setCreateNoteState({ track });
        handleRouting("/create-note");
    };

    const share = async () => {
        if (!track) return;
        shareTrack(track.getID());
        setShareState({ entity: track });
        handleRouting("/share");
    };

    const queue = async () => {
        if (!track) return;
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
    };

    const note = async () => {
        if (!track) return;
        setCreateNoteState({ track });
        handleRouting(`/(sheets)/create-note`);
    };

    const remove = async () => {
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
    };

    const catchSaveTrackEvent = (trackID: number) => {
        if (track && trackID === track.getID()) setSaved(true);
    };

    const catchRemoveTrackEvent = (trackID: number) => {
        if (track && trackID === track.getID()) setSaved(false);
    };

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