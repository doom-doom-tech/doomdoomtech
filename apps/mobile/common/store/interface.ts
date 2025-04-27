import {create} from "zustand";

const initialInterfaceStore = <InitialInterfaceStore>{

}

interface InitialInterfaceStore {

}

interface InterfaceStore extends InitialInterfaceStore {
	actions : {
		setState: (values: Partial<InitialInterfaceStore>) => void
	}
}

const InterfaceStore = create<InterfaceStore>((set, get) => ({
	...initialInterfaceStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useInterfaceStoreSelectors = {
    setState: () => InterfaceStore(state => state.actions.setState)
}