import {create} from "zustand";
import {TrackInterface} from "@/features/track/types";

const initialUploadProgressStore = <InitialUploadProgressStore>{
    active: false,
	track: null
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
    active: () => UploadProgressStore(state => state.active),
	track: () => UploadProgressStore(state => state.track),
    setState: () => UploadProgressStore(state => state.actions.setState)
}