import {$Enums} from "@prisma/client";

export interface MediaInterface {
    id: number
    url: string
    type: $Enums.MediaType
}