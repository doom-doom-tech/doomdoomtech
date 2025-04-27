import {Prisma} from "@prisma/client";
import {SubgenreInterface} from "../types";

export class SubgenreMapper {
    public static getSelectableFields(): Prisma.SubGenreSelect {
        return {
            id: true,
            name: true,
            group: true
        }
    }

    public static format(genre: Record<any, any>): SubgenreInterface {
        return {
            id: genre.id ?? 0,
            name: genre.name ?? '',
            group: genre.group ?? ''
        };
    }
}