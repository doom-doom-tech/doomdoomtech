import {NoteInterface} from "../../note/types";
import {TrackInterface} from "../../track/types";
import {TrackMapper} from "../../track/mappers/TrackMapper";
import NoteMapper from "../../note/mappers/NoteMapper";
import {TODO} from "../../../common/types";
import _ from "lodash";

// Define FeedItemType as a union of TrackInterface and NoteInterface
// (Assuming this is defined elsewhere in your types)
export type FeedItemType = TrackInterface | NoteInterface;

export class FeedItemMapper {
    /**
     * Converts a database record into a FeedItemType based on the specified type.
     * @param data The database record to transform.
     * @param type The type of the feed item ('Track' or 'Note').
     * @returns A formatted FeedItemType object.
     * @throws Error if an unsupported type is provided.
     */
    public static format(data: TODO, type: 'Track' | 'Note'): FeedItemType {
        if (type === 'Track') {
            return TrackMapper.format(data);
        } else if (type === 'Note') {
            return NoteMapper.format(data);
        } else {
            throw new Error(`Unsupported feed item type: ${type}`);
        }
    }

    public static formatMany(data: Array<TODO>, type: 'Track' | 'Note'): Array<FeedItemType> {
        if (type === 'Track') {
            return _.map(data, item => TrackMapper.format(item))
        } else if (type === 'Note') {
            return _.map(data, item => NoteMapper.format(item))
        } else {
            throw new Error(`Unsupported feed item type: ${type}`);
        }
    }
}