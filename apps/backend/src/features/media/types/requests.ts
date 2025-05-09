import {$Enums} from "@prisma/client";
import {Request} from "express";


export interface UploadMediaRequest {
    uuid: string
    file: Express.Multer.File;
    purpose: "track.audio" | "track.video" | "track.cover" | "user.avatar" | "user.banner" | "note.attachment"
}

export interface ProcessMediaRequest {
    filePath: string
    totalFiles: number
    entityUUID: string
    entityType:  'Track' | 'User' | 'Album' | 'Note'
}

export interface CreateMediaRequest {
    url: string
    type: $Enums.MediaType
    userID?: number
    albumID?: number
    trackID?: number
}

export interface ProcessAttachmentRequest {
    uuid: string
    purpose: "track.audio" | "track.video" | "track.cover" | "user.avatar" | "user.banner" | "note.attachment"
    type:  'Track' | 'User' | 'Album' | 'Note'
}

export interface ProcessMediaBatchRequest extends Request {
    body: { items: string }
    files: Express.Multer.File[]
}