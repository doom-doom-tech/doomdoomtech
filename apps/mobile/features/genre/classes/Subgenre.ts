import {SubgenreInterface} from "@/features/genre/types";

export default class Subgenre {
    constructor(private readonly data: SubgenreInterface)
    {}

    getID() {
        return this.data.id
    }

    getName() {
        return this.data.name
    }

    getGroup() {
        return this.data.group
    }
}