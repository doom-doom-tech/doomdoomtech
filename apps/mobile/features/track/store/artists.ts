import {create} from "zustand";
import User from "@/features/user/classes/User";

const initialArtistsStore = <InitialArtistsStore>{
    artists: []
}

interface InitialArtistsStore {
    artists: Array<User>
}

interface ArtistsStore extends InitialArtistsStore {
	actions : {
		setState: (values: Partial<InitialArtistsStore>) => void
	}
}

const ArtistsStore = create<ArtistsStore>((set, get) => ({
	...initialArtistsStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useArtistsStoreSelectors = {
    artists: () => ArtistsStore(state => state.artists),
    setState: () => ArtistsStore(state => state.actions.setState)
}