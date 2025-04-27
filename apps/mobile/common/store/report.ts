import {create} from "zustand";

const initialReportStore = <InitialReportStore>{
    entityType: 'Track',
    entityID: 0,
}

interface InitialReportStore {
    entityType: 'Track' | 'Note' | 'Album'
    entityID: number
}

interface ReportStore extends InitialReportStore {
	actions : {
		setState: (values: Partial<InitialReportStore>) => void
	}
}

const ReportStore = create<ReportStore>((set, get) => ({
	...initialReportStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values }))
	}
}))

export const useReportStoreSelectors = {
    entityID: () => ReportStore(state => state.entityID),
    entityType: () => ReportStore(state => state.entityType),
    setState: () => ReportStore(state => state.actions.setState)
}