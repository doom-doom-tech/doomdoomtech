import {create} from "zustand";
import Track from "@/features/track/classes/Track";

const initialMandatoryRatingStore = <InitialMandatoryRatingStore>{
	active: false,
    played: []
}

interface InitialMandatoryRatingStore {
	active: boolean
    played: Array<Track>
}

interface MandatoryRatingStore extends InitialMandatoryRatingStore {
	actions : {
		setState: (values: Partial<InitialMandatoryRatingStore>) => void
	}
}

const MandatoryRatingStore = create<MandatoryRatingStore>((set, get) => ({
	...initialMandatoryRatingStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useMandatoryRatingStoreSelectors = {
    active: () => MandatoryRatingStore(state => state.active),
    played: () => MandatoryRatingStore(state => state.played),
    setState: () => MandatoryRatingStore(state => state.actions.setState)
}