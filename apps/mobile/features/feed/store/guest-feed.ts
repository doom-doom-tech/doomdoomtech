import {create} from "zustand";

const initialGuestFeedStore = <InitialGuestFeedStore>{

}

interface InitialGuestFeedStore {

}

interface GuestFeedStore extends InitialGuestFeedStore {
	actions : {
		setState: (values: Partial<InitialGuestFeedStore>) => void
	}
}

const GuestFeedStore = create<GuestFeedStore>((set, get) => ({
	...initialGuestFeedStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useGuestFeedStoreSelectors = {
    setState: () => GuestFeedStore(state => state.actions.setState)
}