import {create} from "zustand";

const initialPersonalizeStore = <InitialPersonalizeStore>{
    genres: [],
	visible: true
}

interface InitialPersonalizeStore {
    genres: Array<number>
	visible: boolean
}

interface PersonalizeStore extends InitialPersonalizeStore {
	actions : {
		setState: (values: Partial<InitialPersonalizeStore>) => void
	}
}

const PersonalizeStore = create<PersonalizeStore>((set, get) => ({
	...initialPersonalizeStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const usePersonalizeStoreSelectors = {
    genres: () => PersonalizeStore(state => state.genres),
	visible: () => PersonalizeStore(state => state.visible),
    setState: () => PersonalizeStore(state => state.actions.setState)
}