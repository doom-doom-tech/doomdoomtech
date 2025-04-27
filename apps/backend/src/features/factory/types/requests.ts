export interface FakePlayEventRequest {
    trackID: number
    artistID: number
}

export interface FakeRateEventRequest {
    trackID: number
    artistID: number
}

export interface FakeFollowEventRequest {
    userID: number
    followsID: number
}