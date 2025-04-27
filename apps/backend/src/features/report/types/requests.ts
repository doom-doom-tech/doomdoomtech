export interface ReportEntityRequest {
    content: string
    entityID: number
    entityType: 'Note' | 'Track' | 'User' | 'Album' | 'Comment'
}