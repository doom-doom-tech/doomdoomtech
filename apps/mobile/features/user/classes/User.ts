import {UserInterface} from "@/features/user/types";

class User {

    constructor(protected readonly data: UserInterface)
    {}

    public getID() {
        return this.data.id
    }

    public getType() {
        return 'User'
    }

    public getUUID() {
        return this.data.uuid
    }

    public isLabel() {
        return this.data.label
    }

    public isPremium() {
        return this.data.premium
    }

    public getImageSource() {
        return this.data.avatar_url
    }

    public getUsername() {
        return this.data.username
    }

    public verified() {
        return this.data.verified
    }

    public following() {
        return this.data.following
    }

    public getTracksCount() {
        return this.data.tracks_count
    }

    public serialize() {
        return this.data
    }
}

export default User