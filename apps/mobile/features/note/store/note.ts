import {create} from "zustand";
import Note from "@/features/note/classes/Note";

const initialNoteStore = <InitialNoteStore>{
    note: undefined
}

interface InitialNoteStore {
    note: Note | undefined
}

interface NoteStore extends InitialNoteStore {
	actions : {
		setState: (values: Partial<InitialNoteStore>) => void
	}
}

const NoteStore = create<NoteStore>((set, get) => ({
	...initialNoteStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useNoteStoreSelectors = {
    note: () => NoteStore(state => state.note),
    setState: () => NoteStore(state => state.actions.setState)
}