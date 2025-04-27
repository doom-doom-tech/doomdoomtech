import {NoteInterface} from "@/features/note/types";
import User from "@/features/user/classes/User";
import Track from "@/features/track/classes/Track";

class Note {
    constructor(private readonly data: NoteInterface)
    {}

    getID() {
        return this.data.id
    }

    getUUID() {
        return this.data.uuid
    }

    public getType() {
        return this.data.type
    }

    getContent() {
        return this.data.content
    }

    getUser() {
        return new User(this.data.user)
    }

    getTrack() {
        return this.data.track ? new Track(this.data.track) : null
    }

    getComments() {
        return this.data.comments
    }

    getLooper() {
        return this.data.looper ? new User(this.data.looper) : null
    }

    getMedia() {
        return this.data.media
    }

    getLikesCount() {
        return this.data.likes_count
    }

    getCommentsCount() {
        return this.data.comments_count
    }

    getLoopsCount() {
        return this.data.loops_count
    }

    getTimestamp() {
        return this.data.created
    }

    looped() {
        return this.data.looped
    }

    liked() {
        return this.data.liked
    }

    deleted() {
        return this.data.deleted
    }
}

export default Note