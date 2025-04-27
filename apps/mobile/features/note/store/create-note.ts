import {create} from "zustand";
import Track from "@/features/track/classes/Track";
import {ImagePickerAsset} from "expo-image-picker";

export const initialCreateNoteStore = <InitialCreateNoteStore>{
    track: null,
    content: '',
    attachments: []
}

interface InitialCreateNoteStore {
    content: string
    track: Track | null
    attachments: Array<ImagePickerAsset>
}

interface CreateNoteStore extends InitialCreateNoteStore {
	actions : {
		setState: (values: Partial<InitialCreateNoteStore>) => void
	}
}

const CreateNoteStore = create<CreateNoteStore>((set, get) => ({
	...initialCreateNoteStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useCreateNoteValues = () => CreateNoteStore(state => state)

export const useCreateNoteStoreSelectors = {
    track: () => CreateNoteStore(state => state.track),
    content: () => CreateNoteStore(state => state.content),
    attachments: () => CreateNoteStore(state => state.attachments),
    setState: () => CreateNoteStore(state => state.actions.setState)
}