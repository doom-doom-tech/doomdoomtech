import Track from "@/features/track/classes/Track";
import {PlaybackProgressUpdatedEvent} from "react-native-track-player/src/interfaces/events/PlaybackProgressUpdatedEvent";
import {State} from "react-native-track-player";

export interface MediaEvents {
    'PLAY': MediaPlayEvent
    'PAUSE': MediaPauseEvent
    'STOP': MediaStopEvent
    'LOAD': MediaLoadEvent
    'SEEK': MediaSeekEvent
    'STATE': MediaStateUpdateEvent
    'PROGRESS': MediaProgressUpdateEvent
}

export interface MediaSeekEvent {
    position: number
}

export interface MediaLoadEvent {
    track: Track;
}

export interface MediaProgressUpdateEvent extends PlaybackProgressUpdatedEvent
{}

export interface MediaPlayEvent
{}

export interface MediaPauseEvent
{}

export interface MediaStopEvent
{}

export interface MediaStateUpdateEvent {
    state: State
}