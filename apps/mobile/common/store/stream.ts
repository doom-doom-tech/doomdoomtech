import {create} from "zustand";
import Track from "@/features/track/classes/Track";

export const initialStreamStore = <InitialStreamStore>{
    playtime: 0,
    totalPlaytime: 0,
    track: undefined,
}

interface InitialStreamStore {
    playtime: number
    totalPlaytime: number
    track: Track | undefined
}

interface StreamStore extends InitialStreamStore {
	actions : {
		setState: (values: Partial<InitialStreamStore>) => void
	}
}

const StreamStore = create<StreamStore>((set, get) => ({
	...initialStreamStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useStreamStoreSelectors = {
    track: () => StreamStore(state => state.track),
    playtime: () => StreamStore(state => state.playtime),
    totalPlaytime: () => StreamStore(state => state.totalPlaytime),
    setState: () => StreamStore(state => state.actions.setState)
}