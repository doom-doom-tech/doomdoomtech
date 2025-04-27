import {Prisma} from "@prisma/client";
import {TrackMapper} from "./TrackMapper";
import {AuthenticatedRequest} from "../../auth/types/requests";
import {TrackInterface} from "../types";

export class ListTrackMapper {
    public static getSelectableFields(data: AuthenticatedRequest): Prisma.ListTrackSelect {
        return {
            track: {
                select: TrackMapper.getSelectableFields()
            },
            position: true,
        }
    }

    public static formatMany(tracks: Array<Prisma.ListTrackGetPayload<{ select: ReturnType<typeof ListTrackMapper.getSelectableFields> }>>): TrackInterface[] {
        return tracks.map(track => ({
            ...TrackMapper.format(track.track),
            position: track.position ?? 0
        }));
    }
}