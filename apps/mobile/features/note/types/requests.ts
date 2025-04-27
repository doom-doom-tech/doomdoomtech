import {NoteAttachmentInterface} from "@/features/note/types/index";

export interface NoteIDRequest {
    noteID: number
}

export interface CreateNoteRequest {
    uuid: string
    content: string
    trackID?: number
    attachments?: Array<NoteAttachmentInterface>
}