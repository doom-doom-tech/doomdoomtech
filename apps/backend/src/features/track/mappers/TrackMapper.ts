import {Like, Prisma} from "@prisma/client";
import {UserMapper} from "../../user/mappers/UserMapper";
import {GenreMapper} from "../../genre/mappers/GenreMapper";
import {SubgenreMapper} from "../../genre/mappers/SubgenreMapper";
import _ from "lodash";
import {SingleTrackInterface, TrackInterface, TrackMetadataInterface} from "../types";
import {Context} from "../../../common/utils/context";
import CommentMapper from "../../comment/mappers/CommentMapper";
import {UserInterface} from "../../user/types";
import {TODO} from "../../../common/types";

export class TrackMapper {
    public static getSelectableFields(): Prisma.TrackSelect {
        return {
            id: true,
            uuid: true,
            title: true,
            likes: true,
            metrics: true,
            created: true,
            metadata: true,
            video_url: true,
            audio_url: true,
            cover_url: true,
            main_artist: true,
            waveform_url: true,
            lists: {
                where: {
                    list: {
                        userID: Context.get('authID')
                    }
                }
            },
            artists: {
                select: {
                    user: {
                        select: UserMapper.getSelectableFields()
                    }
                },
            },
            genre: {
                select: {
                    id: true, name: true, subgenres: false
                }
            },
            subgenre: {
                select: SubgenreMapper.getSelectableFields()
            }
        }
    }

    public static format(data: any): TrackInterface {
        const authID = Context.get('authID')
        const liked = data.likes?.some((like: Like) => like.userID === authID) ?? false

        return {
            id: data.id,
            type: 'Track',
            liked: liked,
            uuid: data.uuid ?? '',
            title: data.title ?? '',
            metrics: data.metrics ?? 0,
            created: data.created ?? 0,
            rated: data.rating && data.rating.length > 0 || false,
            added: data.lists && data.lists.length > 0 || false,
            audio_url: data.audio_url ?? null,
            cover_url: data.cover_url ?? null,
            video_url: data.video_url ?? null,
            metadata: data.metadata ? TrackMapper.formatMetadata(data.metadata) : null,
            main_artist: data.main_artist ?? 0,
            waveform_url: data.waveform_url ?? null,
            artists: _.map(data.artists, ({user}) => UserMapper.format(user)),
            genre: GenreMapper.format(data.genre),
            subgenre: SubgenreMapper.format(data.subgenre),
            comments: data.comments ? CommentMapper.formatMany(data.comments) : []
        }
    }

    public static searchable(track: TrackInterface) {
        return {
            objectID: `track-${track.id}`,
            type: 'track',
            created: Math.floor(new Date(track.created).getTime() / 1000),
            users: track.artists.map((artist: UserInterface) => artist.id),
            title: track.title,
            userID: track.main_artist,
            genreID: track.genre.id,
            subgenreID: track.subgenre.id,
            total_plays: track.metrics?.total_plays || 0,
            total_likes: track.metrics?.total_likes || 0,
            media_type: track.video_url ? 'video' : 'audio',
        }
    }

    public static formatMany(tracks: Array<any>): SingleTrackInterface[] {
        return _.map(tracks, track => TrackMapper.format(track))
    }

    private static formatMetadata(data: TODO): TrackMetadataInterface {
        return {
            era: data.era,
            key: data.key,
            energy: data.energy,
            bpm: Number(data.bpm),
            emotion: data.emotion,
            mood: data.mood ? JSON.parse(data.mood) : [],
            instruments: data.instruments ? JSON.parse(data.instruments) : [],
        }
    }
}