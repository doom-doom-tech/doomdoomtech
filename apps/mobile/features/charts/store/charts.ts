import {create} from "zustand";

const initialChartsStore = <InitialChartsStore>{
    loading: true
}

interface InitialChartsStore {
    loading: boolean
}

interface ChartsStore extends InitialChartsStore {
	actions : {
		setState: (values: Partial<InitialChartsStore>) => void
	}
}

const ChartsStore = create<ChartsStore>((set, get) => ({
	...initialChartsStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useChartsStoreSelectors = {
    loading: () => ChartsStore(state => state.loading),
    setState: () => ChartsStore(state => state.actions.setState)
}