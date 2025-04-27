import {create} from "zustand";
import {DocumentPickerAsset} from "expo-document-picker";
import User from "@/features/user/classes/User";
import {SubgenreInterface} from "@/features/genre/types";
import SingleUser from "@/features/user/classes/SingleUser";

export type Boost = 'mastering'

export type UploadableArtist = {
	artist: User | SingleUser
	role: "Artist" | "Producer" | "Songwriter"
	royalties: number
}

export interface UploadNoteInterface {
	active: boolean
	content: string
}

export const initialUploadStore = <InitialUploadStore>{
	caption: '',
	boosts: {
		mastering: false,
	},
	note: {
		content: '',
		active: false,
	},
	title: '',
	genre: undefined,
    files: [],
	artists: [],
	explicit: false,
	subgenre: 0,
	preview: undefined,
	tags: [],
}

interface InitialUploadStore {
	caption: string
	boosts: Record<Boost, boolean>
	note: UploadNoteInterface
	explicit: boolean
	artists: Array<UploadableArtist>
	tags: Array<number>
	subgenre: number
    files: Array<DocumentPickerAsset>
	preview: string | undefined
	title: string
	genre: Nullable<SubgenreInterface>
}

interface UploadStore extends InitialUploadStore {
	actions : {
		setState: (values: Partial<InitialUploadStore>) => void
	}
}

const UploadStore = create<UploadStore>((set, get) => ({
	...initialUploadStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useUploadStore = () => UploadStore(state => state);

export const useUploadStoreSelectors = {
	note: () => UploadStore(state => state.note),
	title: () => UploadStore(state => state.title),
	genre: () => UploadStore(state => state.genre),
	artists: () => UploadStore(state => state.artists),
	tags: () => UploadStore(state => state.tags),
	explicit: () => UploadStore(state => state.explicit),
    files: () => UploadStore(state => state.files),
    preview: () => UploadStore(state => state.preview),
    actions: () => UploadStore(state => state.actions)
}