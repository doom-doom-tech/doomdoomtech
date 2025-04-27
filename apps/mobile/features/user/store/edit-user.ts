import {create} from "zustand";
import {ImagePickerAsset} from "expo-image-picker";
import {SocialPlatformInterface} from "@/features/user/types";

export const initialEditUserStore = <InitialEditUserStore>{
    bio: '',
    socials: [],
    username: '',
    avatar: null,
    banner: null,
}

interface InitialEditUserStore {
    bio: string;
    username: string;
    avatar: ImagePickerAsset | null;
    banner: ImagePickerAsset | null;
    socials: Array<SocialPlatformInterface>;
}

interface EditUserStore extends InitialEditUserStore {
	actions : {
		setState: (values: Partial<InitialEditUserStore>) => void
	}
}

const EditUserStore = create<EditUserStore>((set, get) => ({
	...initialEditUserStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useEditUserStoreSelectors = {
    values: () => EditUserStore(state => state),
    setState: () => EditUserStore(state => state.actions.setState)
}