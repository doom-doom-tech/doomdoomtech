// hooks/useMediaActions.ts
import {useCallback} from "react";
import TrackPlayer, {State} from "react-native-track-player";
import {useMediaStoreSelectors} from "@/common/store/media";
import {useStreamStoreSelectors} from "@/common/store/stream";
import {useAlgoliaEvents} from "@/common/hooks/useAlgoliaEvents";
import Track from "@/features/track/classes/Track";
import useQueueSync from "@/features/queue/hooks/useQueueSync";
import {trackToNative} from "@/features/queue/utilities";
import {NativeTrack} from "@/features/queue/types";

const useMediaActions = () => {
    const { playTrack } = useAlgoliaEvents();

    const setMediaState = useMediaStoreSelectors.setState();
    const setStreamState = useStreamStoreSelectors.setState();

    const { removeTrack, fillQueue } = useQueueSync();

    const findTrackIndexInQueue = useCallback((track: Track, queue: NativeTrack[]) => {
        return queue.findIndex((queuedTrack) => queuedTrack.id === track.getID());
    }, []);

    const loadTrack = useCallback(async (track: Track) => {
            playTrack(track.getID());

            try {
                await TrackPlayer.load(trackToNative(track));
                await TrackPlayer.play();
                
                setMediaState({ state: State.Playing });
                setStreamState({ track, playtime: 0 });
            } catch (error) {
                console.error('Failed to load track:', error);
                throw error;
            }
        },
        [findTrackIndexInQueue, removeTrack]
    );

    return { loadTrack, fillQueue };
};

export default useMediaActions;