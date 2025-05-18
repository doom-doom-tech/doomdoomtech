import { create } from "zustand"

const initialRoutingStore = <InitialRoutingStore>{
    isModal: false
}

interface InitialRoutingStore {
    isModal: boolean
}

interface RoutingStore extends InitialRoutingStore {
    actions: {
        setState: (values: Partial<InitialRoutingStore>) => void
    }
}

export const useRoutingStore = create<RoutingStore>((set) => ({
    ...initialRoutingStore,
    actions: {
        setState: (values) => set(values)
    }
}))

export const useRoutingStoreSelectors = {
    isModal: () => useRoutingStore.getState().isModal,
    setState: () => useRoutingStore.getState().actions.setState
}