import {GenreInterface} from "@/features/genre/types";

export default class Genre {
    constructor(private readonly data: GenreInterface)
    {}

    getID() {
        return this.data.id
    }

    getName() {
        return this.data.name
    }

    getSubgenres() {
        return this.data.subgenres
    }
}