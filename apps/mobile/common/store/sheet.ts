import {create} from "zustand";

const initialSheetStore = <InitialSheetStore>{

}

interface InitialSheetStore {

}

interface SheetStore extends InitialSheetStore {
    actions : {
        setState: (values: Partial<InitialSheetStore>) => void
    }
}

const SheetStore = create<SheetStore>((set, get) => ({
    ...initialSheetStore,
    actions: {
        setState: (values) => set(state => ({ ...state, ...values }))
    }
}))

export const useSheetStoreSelectors = {
    setState: () => SheetStore(state => state.actions.setState)
}