import {create} from "zustand";

const initialSearchStore = <InitialSearchStore>{
	query: ''
}

interface InitialSearchStore {
	query: string
}

interface SearchStore extends InitialSearchStore {
	actions : {
		setState: (values: Partial<InitialSearchStore>) => void
	}
}

const SearchStore = create<SearchStore>((set, get) => ({
	...initialSearchStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useSearchStoreSelectors = {
	query: () => SearchStore(state => state.query),
    setState: () => SearchStore(state => state.actions.setState)
}