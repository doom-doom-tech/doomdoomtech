import {create} from "zustand";

const initialTopPicksStore = <InitialTopPicksStore>{
    state: 'idle',
	updated: []
}

interface InitialTopPicksStore {
    state: 'idle' | 'edit'
	updated: Array<{ trackID: number, position: number }>
}

interface TopPicksStore extends InitialTopPicksStore {
	actions : {
		setState: (values: Partial<InitialTopPicksStore>) => void
	}
}

const TopPicksStore = create<TopPicksStore>((set, get) => ({
	...initialTopPicksStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useTopPicksStoreSelectors = {
    state: () => TopPicksStore(state => state.state),
	updated: () => TopPicksStore(state => state.updated),
    setState: () => TopPicksStore(state => state.actions.setState)
}