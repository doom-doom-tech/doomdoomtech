import {create} from "zustand";
import Track from "@/features/track/classes/Track";
import {State} from "react-native-track-player"

type MediaStatus = "playing" | "paused" | "buffering"| "error" | "idle";

interface InitialMediaStore {
    muted: boolean
    playing: boolean
    buffering: boolean
    progress: number
    duration: number
    state: State
    current: Track | null
    videoPreviewMinimized: boolean
}

interface MediaStoreActions {
    setState: (values: Partial<MediaStore>) => void
}

const initialMediaStore = {
    muted: false,
    playing: false,
    buffering: false,
    progress: 0,
    duration: 0,
    state: "none",
    current: null,
    videoPreviewMinimized: false,
} as InitialMediaStore

interface MediaStore extends InitialMediaStore, MediaStoreActions {}

const MediaStore = create<MediaStore>(
    (set) => ({
        ...initialMediaStore,
        setState: (values) => set(state => ({ ...state, ...values }))
    })
);

export const useMediaStoreSelectors = {
    muted: () => MediaStore((state) => state.muted),
    playing: () => MediaStore((state) => state.playing),
    buffering: () => MediaStore((state) => state.buffering),
    progress: () => MediaStore((state) => state.progress),
    duration: () => MediaStore((state) => state.duration),
    state: () => MediaStore((state) => state.state),
    current: () => MediaStore((state) => state.current),
    videoPreviewMinimized: () => MediaStore((state) => state.videoPreviewMinimized),
    setState: () => MediaStore((state) => state.setState),
};
