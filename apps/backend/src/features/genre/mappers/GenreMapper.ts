import {Prisma} from "@prisma/client";
import {GenreInterface} from "../types";
import {SubgenreMapper} from "./SubgenreMapper";

export class GenreMapper {

    public static getSelectableFields(): Prisma.GenreSelect {
        return {
            id: true,
            name: true,
            subgenres: {
                select: SubgenreMapper.getSelectableFields()
            }
        }
    }

    public static format(genre: any): GenreInterface {
        return {
            id: genre.id ?? 0,
            name: genre.name ?? '',
            subgenres: genre.subgenres ?? []
        };
    }
}