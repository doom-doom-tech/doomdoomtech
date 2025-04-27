import {AlbumInterface} from "@/features/album/types";

class Album {

    constructor(protected readonly data: AlbumInterface)
    {}

    getID() {
        return this.data.id
    }

    public getType() {
        return this.data.type
    }

    getUUID() {
        return this.data.uuid
    }

    getName() {
        return this.data.name
    }

    getCreationDate() {
        return this.data.created
    }

    getArtist() {
        return this.data.user
    }

    getCoverSource() {
        return this.data.cover_url
    }

    getTracksCount() {
        return this.data.tracks_count ?? 0
    }
}

export default Album