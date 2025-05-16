import {create} from "zustand";
import Track from "@/features/track/classes/Track";

const initialTrackStore = {
    track: null
}

interface InitialTrackStore {
    track: Track | null
}

interface TrackStore extends InitialTrackStore {
    actions : {
        setState: (values: Partial<InitialTrackStore>) => void
    }
}

const TrackStore = create<TrackStore>((set, get) => ({
    ...initialTrackStore,
    actions: {
        setState: (values) => set(state => ({ ...state, ...values }))
    }
}))

export const useTrackStoreSelectors = {
    track: () => TrackStore(state => state.track),
    setState: () => TrackStore(state => state.actions.setState)
}