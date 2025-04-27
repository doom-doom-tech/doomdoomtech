import {create} from "zustand";
import {ImagePickerAsset} from "expo-image-picker";
import Track from "@/features/track/classes/Track";


const initialManageAlbumStore = <InitialManageAlbumStore>{
    name: '',
    tracks: [],
    cover: undefined,
    release: new Date()
}

interface InitialManageAlbumStore {
    name: string
    release: Date
    tracks: Array<Track>
    cover: ImagePickerAsset | undefined
}

interface ManageAlbumStore extends InitialManageAlbumStore {
	actions : {
		setState: (values: Partial<InitialManageAlbumStore>) => void
	}
}

const ManageAlbumStore = create<ManageAlbumStore>((set, get) => ({
	...initialManageAlbumStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useManageAlbumStoreSelectors = {
    name: () => ManageAlbumStore(state => state.name),
    cover: () => ManageAlbumStore(state => state.cover),
    tracks: () => ManageAlbumStore(state => state.tracks),
    release: () => ManageAlbumStore(state => state.release),
    setState: () => ManageAlbumStore(state => state.actions.setState)
}