import {CommentInterface} from "@/features/comment/types";

class Comment {
    constructor(private readonly data: CommentInterface)
    {}

    getID() {
        return this.data.id
    }

    getParentID() {
        return this.data.parentID
    }

    getSender() {
        return this.data.sender
    }

    getContent() {
        return this.data.content
    }

    getTimestamp() {
        return this.data.created
    }

    getEntity() {
        return this.data.entity
    }

    getEntityID() {
        return this.data.entityID
    }

    isDeleted() {
        return this.data.deleted
    }

    liked() {
        return this.data.liked
    }

    getLikesCount() {
        return this.data.likes
    }
}

export default Comment