import {useCallback} from "react";
import {Track as NativeTrack} from "react-native-track-player/lib/src/interfaces/Track";
import TrackPlayer, {State} from "react-native-track-player"
import {useStreamStoreSelectors} from "@/common/store/stream";
import {useMediaStoreSelectors} from "@/common/store/media";
import Track from "@/features/track/classes/Track";
import {useQueueStoreSelectors} from "@/common/store/queue";
import {useAlgoliaEvents} from "@/common/hooks/useAlgoliaEvents";

const useMediaActions = () => {

    const { playTrack } = useAlgoliaEvents()

    const queue = useQueueStoreSelectors.queue();
    const setQueueState = useQueueStoreSelectors.setState();
    const removeQueueTrack = useQueueStoreSelectors.removeTrack();

    const setStreamState = useStreamStoreSelectors.setState();
    const setMediaState = useMediaStoreSelectors.setState();
    const currentTrack = useMediaStoreSelectors.current();

    const findTrackIndexInQueue = useCallback((track: Track) => {
        return queue.findIndex((queuedTrack) => queuedTrack.getID() === track.getID());
    }, [queue]);

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

    const fillQueue = useCallback(async (tracks: Array<Track>) => {
        try {
            if(!currentTrack) return

            const playerTracks = tracks
                .filter((track) => track.getID() !== currentTrack.getID())

            await TrackPlayer.removeUpcomingTracks()

            await TrackPlayer.add(playerTracks.map<NativeTrack>((track) => ({
                id: track.getID(),
                url: track.getAudioSource() as string,
                title: track.getTitle(),
                artist: track.getMainArtist().getUsername(),
                artwork: track.getCoverSource() || 'https://play-lh.googleusercontent.com/Cg5EcFiy1xg6VIt_Q2gnp8rvRjVM-r7Pz2Zvw6aCPYD-wsky8RuEU58t58ktA4HAvj8',
            })));

            setQueueState({ queue: [currentTrack, ...playerTracks] });
        } catch (error) {
            console.error('Error constructing queue:', error);
        }
    }, [setQueueState, setMediaState, currentTrack]);

    const loadTrack = useCallback(async (track: Track) => {

        // Algolia event
        playTrack(track.getID())

        try {
            const metadata: NativeTrack = {
                id: track.getID(),
                url: track.getAudioSource() as string,
                title: track.getTitle(),
                artist: track.getMainArtist().getUsername(),
                artwork: track.getCoverSource() || 'https://play-lh.googleusercontent.com/Cg5EcFiy1xg6VIt_Q2gnp8rvRjVM-r7Pz2Zvw6aCPYD-wsky8RuEU58t58ktA4HAvj8',
            };

            await TrackPlayer.load(metadata)
            await TrackPlayer.play()

            // Check if track is in the queue and remove it
            const trackIndex = findTrackIndexInQueue(track);
            await removeTrackFromQueue(trackIndex);

            setMediaState({ current: track, state: State.Playing })
            setStreamState({ track, playtime: 0 })
        } catch (error: any) {

            throw error;
        }
    }, [removeTrackFromQueue, findTrackIndexInQueue])

    return { loadTrack, fillQueue }
}

export default useMediaActions