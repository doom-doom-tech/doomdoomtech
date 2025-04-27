import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TimeTrackStore {
	tracking: boolean;
	totalTimeSpent: number;
	trackingStartTime: number | null;
	startTracking: () => void;
	stopTracking: () => void;
	resetStore: () => void;
}

const initialTimeTrackStore: Omit<TimeTrackStore, 'startTracking' | 'stopTracking' | 'resetStore'> = {
	tracking: false,
	totalTimeSpent: 0,
	trackingStartTime: null
};

const TimeTrackStore = create<TimeTrackStore>()(
	persist(
		(set, get) => ({
			...initialTimeTrackStore,
			startTracking: () => {
				const startTime = Date.now();
				set({
					tracking: true,
					trackingStartTime: startTime
				});
			},
			stopTracking: () => {
				const state = get();
				if (state.tracking && state.trackingStartTime !== null) {
					const endTime = Date.now();
					const sessionTime = endTime - state.trackingStartTime;
					const newTotalTime = state.totalTimeSpent + sessionTime;
					set({
						tracking: false,
						trackingStartTime: null,
						totalTimeSpent: newTotalTime
					});
				} else {
					set({
						tracking: false,
						trackingStartTime: null
					});
				}
			},
			resetStore: () => {
				set(initialTimeTrackStore);
			}
		}),
		{
			name: 'time-tracking',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				totalTimeSpent: state.totalTimeSpent
			}),
			onRehydrateStorage: () => (state) => {
				if (state && (state.totalTimeSpent === null || isNaN(state.totalTimeSpent))) {
					TimeTrackStore.getState().resetStore();
				}
			}
		}
	)
);

export const useTimeTrackStoreTotalTime = () => TimeTrackStore(state => state.totalTimeSpent);
export const useTimeTrackStoreStartTime = () => TimeTrackStore(state => state.trackingStartTime);
export const useTimeTrackStoreTracking = () => TimeTrackStore(state => state.tracking);

export const { startTracking, stopTracking, resetStore } = TimeTrackStore.getState();