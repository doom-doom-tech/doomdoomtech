import {create} from "zustand";

const initialOnboardingStore = <InitialOnboardingStore>{
    index: 0,
    completed: false,
    isHydrated: false,
}

interface InitialOnboardingStore {
    index: number;
    completed: boolean;
    isHydrated: boolean;
    setState: (values: Partial<Omit<OnboardingStore, 'setState' | 'isHydrated'>>) => void;
}

interface OnboardingStore extends InitialOnboardingStore {
	actions : {
		setState: (values: Partial<InitialOnboardingStore>) => void
	}
}

const OnboardingStore = create<OnboardingStore>((set, get) => ({
	...initialOnboardingStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useOnboardingStoreSelectors = {
    index: () => OnboardingStore(state => state.index),
    completed: () => OnboardingStore(state => state.completed),
    isHydrated: () => OnboardingStore(state => state.isHydrated),
    setState: () => OnboardingStore(state => state.actions.setState)
}