import {useMediaStoreSelectors} from "@/common/store/media";
import TrackPlayer, {Event, useProgress, useTrackPlayerEvents} from "react-native-track-player"
import {useStreamStoreSelectors} from "@/common/store/stream";
import {CONFIG} from "@/common/constants";
import useTrackCreateStream from "@/features/track/hooks/useTrackCreateStream";
import useTrackPlaytimeBatch from "@/features/track/hooks/useTrackPlaytimeBatch";
import {useQueueStoreSelectors} from "@/common/store/queue";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import {useEffect} from "react";
import {useRatingQueueStoreSelectors} from "@/features/track/store/rating-queue";
import {useAlgoliaEvents} from "@/common/hooks/useAlgoliaEvents";
import useTrackLike from "@/features/track/hooks/useTrackLike";
import {DeviceEventEmitter} from "react-native";
import useTrackCreatePlay from "@/features/track/hooks/useTrackPlay";
import useCurrentTrack from "@/features/track/hooks/useCurrentTrack";

const useMediaEvents = () => {

    const progress = useProgress()

    const currentUser = useGlobalUserContext()
    const currentTrack = useCurrentTrack()

    const { rateTrack } = useAlgoliaEvents()

    const createStreamMutation = useTrackCreateStream()
    const batchTrackPlaytimeMutation = useTrackPlaytimeBatch()

    const eligibleForRating = useRatingQueueStoreSelectors.eligible()

    const setMediaState = useMediaStoreSelectors.setState();
    const setStreamState = useStreamStoreSelectors.setState();
    const setQueueState = useQueueStoreSelectors.setState();

    const queue = useQueueStoreSelectors.queue()

    const currentPlaytime = useStreamStoreSelectors.playtime()
    const totalPlaytime = useStreamStoreSelectors.totalPlaytime()

    const likeTrackMutation = useTrackLike()

    const setRatingQueueState = useRatingQueueStoreSelectors.setState()
    const currentRatingQueue = useRatingQueueStoreSelectors.current()

    const trackPlayMutation = useTrackCreatePlay()

    // Handle rating when track changes
    useEffect(() => {
        if(currentRatingQueue) {
            rateTrack(currentRatingQueue.id, currentRatingQueue.rating)

            likeTrackMutation.mutate({
                trackID: currentRatingQueue.id,
                amount: currentRatingQueue.rating
            })

            DeviceEventEmitter.emit(
                'track:rate:complete',
                { getID: () => currentRatingQueue.id },
                currentRatingQueue.rating
            )

            setRatingQueueState({ current: null })
        }

        // Handle play request
        currentTrack && trackPlayMutation.mutate({ trackID: currentTrack.getID() })
    }, [currentTrack])

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
        setQueueState({ queue: [] });
    });

    useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
        await TrackPlayer.play()
    });

    useTrackPlayerEvents([Event.PlaybackProgressUpdated], async (event) => {
        setMediaState({ duration: event.duration })

        if(!currentTrack || !currentUser) return

        // check if the track is being played forward instead of a skip/jump & update the playtimes
        if(Math.floor(progress.position) + 1 === Math.floor(event.position)) {
            setStreamState({ playtime: currentPlaytime + 1, totalPlaytime: totalPlaytime + 1 })
        }

        // Check if 10 seconds have passed, send the batch to the server, enable the rating and reset
        if(currentPlaytime === 10) {
            setRatingQueueState({
                eligible: new Set([...eligibleForRating, currentTrack.getID()])
            })

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