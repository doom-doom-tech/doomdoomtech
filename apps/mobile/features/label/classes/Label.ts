import {LabelInterface} from "@/features/label/types";

class Label {

    constructor(protected readonly data: LabelInterface)
    {}

    public getType() {
        return 'Label'
    }

    public getID() {
        return this.data.id
    }

    public getTAG() {
        return this.data.tag
    }

    public isPremium() {
        return this.data.premium
    }

    public getUUID() {
        return this.data.uuid
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
}

export default Label