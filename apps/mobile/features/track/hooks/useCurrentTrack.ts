import {useActiveTrack} from "react-native-track-player"
import {useQueueStoreSelectors} from "@/common/store/queue"
import Track from "@/features/track/classes/Track"

const useCurrentTrack = () => {

    const queue = useQueueStoreSelectors.queue()
    const activeNativeTrack = useActiveTrack()

    if(!activeNativeTrack) return null
    return queue.find(track => track.getID() === activeNativeTrack.id) as Track
}

export default useCurrentTrack