export interface GenreInterface {
    id: number
    name: string
    subgenres: Array<SubgenreInterface>
}

export interface SubgenreInterface {
    id: number
    name: string
    group: string
}