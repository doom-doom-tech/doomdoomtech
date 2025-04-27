import {create} from "zustand";
import Genre from "@/features/genre/classes/Genre";
import {periods} from "@/features/filter/screens/FilterPeriod";
import User from "@/features/user/classes/User";
import SingleUser from "@/features/user/classes/SingleUser";

export type FilterPeriod = 7 | 24 | 30 | 'infinite'
export type AvailableFilters = 'period' | 'label' | 'genre' | 'subgenre'

export const initialFilterStore = <InitialFilterStore>{
    available: [],
    user: undefined,
    genre: undefined,
    label: undefined,
    subgenre: undefined,
    period: { value: 'infinite', label: 'All time' },
}

interface InitialFilterStore {
    genre: Genre | undefined
    label: string | undefined
    subgenre: Genre | undefined
    period: typeof periods[number]
    user: User | SingleUser | undefined
    available: Array<AvailableFilters>
}

interface FilterStore extends InitialFilterStore {
	actions : {
		setState: (values: Partial<InitialFilterStore>) => void
	}
}

const FilterStore = create<FilterStore>((set, get) => ({
	...initialFilterStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useFilterStoreValues = () => FilterStore(state => state)

export const useFilterStoreSelectors = {
    user: () => FilterStore(state => state.user),
    period: () => FilterStore(state => state.period),
    genre: () => FilterStore(state => state.genre),
    available: () => FilterStore(state => state.available),
    subgenre: () => FilterStore(state => state.subgenre),
    label: () => FilterStore(state => state.label),
    setState: () => FilterStore(state => state.actions.setState)
}