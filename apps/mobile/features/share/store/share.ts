import {create} from "zustand";
import Track from "@/features/track/classes/Track";

const initialShareStore = <InitialShareStore>{
    entity: undefined
}

interface InitialShareStore {
    entity: Track | undefined
}

interface ShareStore extends InitialShareStore {
	actions : {
		setState: (values: Partial<InitialShareStore>) => void
	}
}

const ShareStore = create<ShareStore>((set, get) => ({
	...initialShareStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useShareStoreSelectors = {
    entity: () => ShareStore(state => state.entity),
    setState: () => ShareStore(state => state.actions.setState)
}