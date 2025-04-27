import {create} from "zustand";

const initialAuthStore = <InitialAuthStore>{
	authorized: false,
	email: undefined,
}

interface InitialAuthStore {
	authorized: boolean
	email: undefined | string
}

interface AuthStore extends InitialAuthStore {
	actions : {
		setState: (values: Partial<InitialAuthStore>) => void
	}
}

const AuthStore = create<AuthStore>((set, get) => ({
	...initialAuthStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useAuthStoreSelectors = {
	email: () => AuthStore(state => state.email),
	authorized: () => AuthStore(state => state.authorized),
    setState: () => AuthStore(state => state.actions.setState)
}