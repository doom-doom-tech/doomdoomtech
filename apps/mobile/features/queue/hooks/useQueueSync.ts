import TrackPlayer from "react-native-track-player";
import {useQueueStoreSelectors} from "@/common/store/queue";
import Track from "@/features/track/classes/Track";
import {trackToNative} from "@/features/queue/utilities";

const useQueueSync = () => {
    const addTrackZustand = useQueueStoreSelectors.addTrack();
    const removeTrackZustand = useQueueStoreSelectors.removeTrack();
    const setQueueZustand = useQueueStoreSelectors.setState();
    const queue = useQueueStoreSelectors.queue();

    const addTrack = async (track: Track) => {
        await TrackPlayer.add([trackToNative(track)]);
        addTrackZustand(track);
    };

    const removeTrack = async (index: number) => {
        await TrackPlayer.remove(index);
        removeTrackZustand(index);
    };

    const moveTrack = async (from: number, to: number) => {
        await TrackPlayer.remove(from);
        const updatedQueue = [...queue];
        const [moved] = updatedQueue.splice(from, 1);
        updatedQueue.splice(to, 0, moved);
        await TrackPlayer.add(trackToNative(moved), to);
        setQueueZustand({ queue: updatedQueue });
    };

    const clearQueue = async () => {
        await TrackPlayer.reset();
        setQueueZustand({ queue: [] });
    };

    const fillQueue = async (tracks: Track[]) => {
        await TrackPlayer.reset();
        await TrackPlayer.add(tracks.slice(1).map(trackToNative));
        setQueueZustand({ queue: tracks });
    };

    return {
        addTrack,
        removeTrack,
        moveTrack,
        clearQueue,
        fillQueue,
    };
};

export default useQueueSync;