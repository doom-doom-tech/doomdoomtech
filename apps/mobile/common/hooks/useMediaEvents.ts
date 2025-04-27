import {useMediaStoreSelectors} from "@/common/store/media";
import Track from "@/features/track/classes/Track";
import TrackPlayer, {Event, useProgress, useTrackPlayerEvents} from "react-native-track-player"
import {useStreamStoreSelectors} from "@/common/store/stream";
import {CONFIG} from "@/common/constants";
import useTrackCreateStream from "@/features/track/hooks/useTrackCreateStream";
import useTrackPlaytimeBatch from "@/features/track/hooks/useTrackPlaytimeBatch";
import {useQueueStoreSelectors} from "@/common/store/queue";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import {useCallback} from "react";

type MediaAction = 'play' | 'pause' | 'replace' | 'seek'

export interface MediaEventPayload {
    action: MediaAction
    value: number
    track: Track
}


const useMediaEvents = () => {

    const progress = useProgress()

    const currentUser = useGlobalUserContext()

    const createStreamMutation = useTrackCreateStream()
    const batchTrackPlaytimeMutation = useTrackPlaytimeBatch()

    const setMediaState = useMediaStoreSelectors.setState();
    const setStreamState = useStreamStoreSelectors.setState();
    const setQueueState = useQueueStoreSelectors.setState();

    const queue = useQueueStoreSelectors.queue()
    const removeQueueTrack = useQueueStoreSelectors.removeTrack()
    const moveQueueTrack = useQueueStoreSelectors.moveTrack()

    const currentTrack = useMediaStoreSelectors.current()
    const currentPlaytime = useStreamStoreSelectors.playtime()
    const totalPlaytime = useStreamStoreSelectors.totalPlaytime()

    // Helper: Remove track from both Zustand store and TrackPlayer queue
    const removeTrackFromQueue = useCallback(async (index: number) => {
        if (index === -1) return;

        try {
            // Remove from TrackPlayer queue
            await TrackPlayer.remove(index);
            // Remove from Zustand store
            removeQueueTrack(index);
        } catch (error) {
            console.error('Error removing track from queue:', error);
        }
    }, [removeQueueTrack]);

    const moveTrackInQueue = useCallback(async (from: number, to: number) => {
        if (to <= 0) return;

        try {
            await TrackPlayer.move(from, to);
            moveQueueTrack(from, to);
        } catch (error) {
            console.error('Error removing track from queue:', error);
        }
    }, [])

    useTrackPlayerEvents([Event.RemoteSeek], async (event) => {
        await TrackPlayer.seekTo(event.position)
    })

    useTrackPlayerEvents([Event.RemotePause], async (event) => {
        await TrackPlayer.pause()
    })

    useTrackPlayerEvents([Event.RemotePlay], async (event) => {
        await TrackPlayer.play()
    })

    useTrackPlayerEvents([Event.RemoteStop], async (event) => {
        await TrackPlayer.stop()
    })

    useTrackPlayerEvents([Event.RemoteNext], async (event) => {
        await TrackPlayer.skipToNext()
    })

    useTrackPlayerEvents([Event.PlaybackState], (event) => {
        setMediaState({ state: event.state })
    })

    useTrackPlayerEvents([Event.PlaybackQueueEnded], (event) => {
        setMediaState({ current: null });
        setQueueState({ queue: [] });
    });

    useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
        try {
            (event.index !== undefined && queue.length) && setMediaState({ current: queue[event.index] });
        } catch (error) {
            console.error('Error handling PlaybackActiveTrackChanged:', error);
        }
    });

    useTrackPlayerEvents([Event.PlaybackProgressUpdated], async (event) => {
        setMediaState({ duration: event.duration })

        if(!currentTrack || !currentUser) return

        // check if the track is being played forward instead of a skip/jump & update the playtimes
        if(Math.floor(progress.position) + 1 === Math.floor(event.position)) {
            setStreamState({ playtime: currentPlaytime + 1, totalPlaytime: totalPlaytime + 1 })
        }

        // Check if 10 seconds have passed, send the batch to the server and reset
        if(currentPlaytime >= 10) {
            await batchTrackPlaytimeMutation.mutateAsync({
                trackID: currentTrack.getID(),
                amount: 10
            })
            setStreamState({ playtime: 0 })
        }

        // detect a stream (30+ seconds of total playtime)
        if(Math.floor(totalPlaytime) === CONFIG.STREAM_THRESHOLD) {
            await createStreamMutation.mutateAsync({
                trackID: currentTrack.getID()
            })
        }
    })
}

export default useMediaEvents