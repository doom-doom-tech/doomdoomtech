import {UserInterface} from "../../user/types";
import {GenreInterface, SubgenreInterface} from "../../genre/types";
import {EntityInterface} from "../../../common/types";
import {CommentInterface} from "../../comment/types";
import {TrackMetricsInterface} from "../services/TrackMetricsService";

export interface TrackMetadataInterface {
    bpm: number
    key: number
    era: string
    energy: string
    emotion: string
    mood: Array<string>
    instruments: Array<string>
}

interface BaseTrackInterface extends EntityInterface {
    id: number
    uuid: string
    title: string
    main_artist: number
    audio_url: string | null
    cover_url: string | null
    video_url: string | null
    waveform_url: string | null
    artists: Array<UserInterface>
}

export interface TrackInterface extends BaseTrackInterface {
    added: boolean
    liked: boolean
    rated: boolean
    created: string
    genre: GenreInterface
    subgenre: SubgenreInterface
    metrics: TrackMetricsInterface
    metadata: TrackMetadataInterface | null
    comments: Array<CommentInterface>
    activity?: Array<any>
}

export interface SingleTrackInterface extends TrackInterface
{}