import {create} from "zustand";
import {TrackInterface} from "@/features/track/types";

const initialUploadProgressStore = <InitialUploadProgressStore>{
    track: null,
    active: true,
}

interface InitialUploadProgressStore {
    active: boolean
    track: TrackInterface | null
}

interface UploadProgressStore extends InitialUploadProgressStore {
	actions : {
		setState: (values: Partial<InitialUploadProgressStore>) => void
	}
}

const UploadProgressStore = create<UploadProgressStore>((set, get) => ({
	...initialUploadProgressStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useUploadProgressStoreSelectors = {
    track: () => UploadProgressStore(state => state.track),
    active: () => UploadProgressStore(state => state.active),
    setState: () => UploadProgressStore(state => state.actions.setState)
}