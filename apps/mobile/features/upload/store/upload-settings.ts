import {create} from "zustand";

export const initialUploadSettingsStore = <InitialUploadSettingsStore>{
    error: false,
    consent: false,
    labelTagsAmount: 5,
    premiumEnabled: false
}

interface InitialUploadSettingsStore {
    error: boolean
    consent: boolean
    labelTagsAmount: number
    premiumEnabled: boolean
}

interface UploadSettingsStore extends InitialUploadSettingsStore {
	actions : {
		setState: (values: Partial<InitialUploadSettingsStore>) => void
	}
}

const UploadSettingsStore = create<UploadSettingsStore>((set, get) => ({
	...initialUploadSettingsStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useUploadSettings = () => UploadSettingsStore(state => state)

export const useUploadSettingsStoreSelectors = {
    setState: () => UploadSettingsStore(state => state.actions.setState)
}