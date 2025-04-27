export interface SaveTrackRequest {
    trackID: number
}

export interface UpdateListTracksRequest {
    tracks: Array<{ trackID: number, position: number }>
}