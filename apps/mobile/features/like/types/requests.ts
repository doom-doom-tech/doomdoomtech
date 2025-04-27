type LikeableEntity = 'Note' | 'Comment' | 'Album' | 'Track'

export interface LikeRequest {
    entity: LikeableEntity
    entityID: number
}