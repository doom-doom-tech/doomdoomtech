import {ReactElement, ReactNode} from 'react'

export type TODO = any

export interface EntityInterface {
    type: string
}

export interface WithChildren {
    children: ReactElement | Array<ReactElement> | ReactNode | Array<ReactNode>
}

export interface SearchQueryInterface {
    query: string
}

export interface NamedSheetRequest {
    name: string
}

export interface MediaActionEventInterface {
    track: any
    action: 'play' | 'pause' | 'mute' | 'unmute' | 'stop' | 'seek' | 'metadata'
    data?: Record<string, any>
}

export interface SimpleIDInterface {
    id: number
}

export interface SimpleUUIDInterface {
    uuid: string
}

export type SimpleSpread <T> = Record<string, T>

export interface SocketConfig {
    reconnection: boolean;
    reconnectionAttempts: number;
    reconnectionDelay: number;
    timeout: number;
}

export const DEFAULT_SOCKET_CONFIG: SocketConfig = {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    timeout: 10000,
};