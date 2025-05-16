import {create} from "zustand";

interface CurrentTrackRating {
	id: number
	rating: number
}

const initialRatingQueueStore = <InitialRatingQueueStore>{
    eligible: new Set<number>(),
	current: null
}

interface InitialRatingQueueStore {
    eligible: Set<number>
	current: CurrentTrackRating | null
}

interface RatingQueueStore extends InitialRatingQueueStore {
	actions : {
		setState: (values: Partial<InitialRatingQueueStore>) => void
	}
}

const RatingQueueStore = create<RatingQueueStore>((set, get) => ({
	...initialRatingQueueStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useRatingQueueStoreSelectors = {
    current: () => RatingQueueStore(state => state.current),
    eligible: () => RatingQueueStore(state => state.eligible),
    setState: () => RatingQueueStore(state => state.actions.setState)
}