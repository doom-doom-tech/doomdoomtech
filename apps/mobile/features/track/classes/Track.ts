import _ from "lodash";
import {TrackActivityInterface, TrackInterface} from "@/features/track/types";
import User from "@/features/user/classes/User";
import {UserInterface} from "@/features/user/types";
import Comment from "@/features/comment/classes/Comment"

class Track {

    constructor(protected data: TrackInterface)
    {}

    public getID() {
        return this.data.id
    }

    public getType() {
        return this.data.type
    }

    public getUUID() {
        return this.data.uuid
    }

    public getTitle () {
        return this.data.title
    }

    public getGenre() {
        return this.data.genre
    }

    public getMetadata() {
        return this.data.metadata
    }

    public getSubGenre() {
        return this.data.subgenre
    }

    public getMetrics() {
        return this.data.metrics
    }

    public getMainArtist() {
        return new User(_.find(this.data.artists, a => a.id === this.data.main_artist) as UserInterface)
    }

    public getArtists() {
        return _.map(this.data.artists, artist => new User(artist))
    }

    public liked() {
        return this.data.liked
    }

    public isAdded() {
        return this.data.added
    }

    public getMediaType() {
        return this.data.video_url ? "video" : 'audio'
    }

    public getMediaSource() {
        return this.data.cover_url
    }

    public getAudioSource() {
        return this.data.audio_url
    }

    public getCoverSource() {
        return this.data.cover_url
    }

    public getVideoSource() {
        return this.data.video_url
    }

    public getWaveformSource() {
        return this.data.waveform_url
    }

    public getLikesCount() {
        return this.data.metrics ? this.data.metrics.total_likes : 0
    }

    public getCommentsCount() {
        return this.data.metrics ? this.data.metrics.total_comments : 0
    }

    public getBPM() {
        return this.data.bpm
    }

    public getKey() {
        return this.data.key
    }

    public getCaption() {
        return this.data.caption
    }

    public getComments() {
        return this.data.comments.map(comment => new Comment(comment))
    }

    public getActivity() {
        return _.map(this.data.activity, activity => ({
            type: activity.type,
            count: this.getRemainingActivityCount(activity),
            users: _.map(activity.users, user => new User(user))
        }))
    }

    public serialize() {
        return this.data
    }

    public saved() {
        return this.data.saved
    }

    public getReleaseDate() {
        return '-'
    }

    private getRemainingActivityCount(activity: TrackActivityInterface) {
        switch (activity.type) {
            case "like": return (this.data.metrics?.total_ratings ?? 0) - activity.users.length
            case "list": return (this.data.metrics?.total_lists ?? 0) - activity.users.length
            default: return 0
        }
    }
}

export default Track