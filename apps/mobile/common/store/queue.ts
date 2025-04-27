import {create} from "zustand";
import Track from "@/features/track/classes/Track";
import _ from "lodash";

const initialQueueStore = <InitialQueueStore>{
    queue: []
}

interface InitialQueueStore {
    queue: Array<Track>
}

interface QueueStore extends InitialQueueStore {
	actions : {
		addTrack: (track: Track) => void
		moveTrack: (from: number, to: number) => void
		removeTrack: (index: number) => void
		setState: (values: Partial<InitialQueueStore>) => void
	}
}

const QueueStore = create<QueueStore>((set, get) => ({
	...initialQueueStore,
	actions: {
		setState: (values) => set(state => ({ ...state, ...values })),
		addTrack: (track: Track) => set(state => ({ queue: [...state.queue, track] })),
		moveTrack: (from: number, to: number) => {
			set((state) => {
				const newQueue = _.clone(state.queue); // Clone the current queue
				const [movedTrack] = newQueue.splice(from, 1); // Remove track from 'from' index
				newQueue.splice(to, 0, movedTrack); // Insert it at 'to' index
				return { queue: newQueue };
			})
		},
		removeTrack: (index: number) => {
			set((state) => {
				const newQueue = _.clone(state.queue);
				_.pullAt(newQueue, [index]);
				return { queue: newQueue };
			})
		}
	}
}))

export const useQueueStoreSelectors = {
    queue: () => QueueStore(state => state.queue),
    setState: () => QueueStore(state => state.actions.setState),
    addTrack: () => QueueStore(state => state.actions.addTrack),
    moveTrack: () => QueueStore(state => state.actions.moveTrack),
	removeTrack: () => QueueStore(state => state.actions.removeTrack),
}