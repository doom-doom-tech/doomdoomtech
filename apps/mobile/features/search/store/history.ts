import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialSearchHistoryStore = <InitialSearchHistoryStore>{
    history: []
}

interface InitialSearchHistoryStore {
    history: Array<string>
}

interface SearchHistoryStore extends InitialSearchHistoryStore {
    add: (query: string) => void
    remove: (query: string) => void
}

const SearchHistoryStore = create<SearchHistoryStore>()(
    persist(
        (set, get) => ({
            ...initialSearchHistoryStore,
            add: (query) => {
                const {history} = get();
                if (!query.trim()) return;
                const newHistory = history.filter(q => q !== query).slice(-19); // keep max 20, removing old dups
                set({history: [...newHistory, query]});
            },
            remove: (query) => {
                const {history} = get();
                set({history: history.filter(q => q !== query)});
            }
        }), {
            name: 'search-history',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                history: state.history
            })
        }
    ))

export const useSearchHistoryStoreAdd = () => SearchHistoryStore(state => state.add);
export const useSearchHistoryStoreHistory = () => SearchHistoryStore(state => state.history);
export const useSearchHistoryStoreRemove = () => SearchHistoryStore(state => state.remove);