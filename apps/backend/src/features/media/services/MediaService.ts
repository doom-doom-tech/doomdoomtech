import {Storage} from "@google-cloud/storage";
import {singleton} from "tsyringe";
import {container} from "../../../common/utils/tsyringe";
import Service, {IServiceInterface} from "../../../common/services/Service";
import {CreateMediaRequest, ProcessAttachmentRequest, UploadMediaRequest} from "../types/requests";
import {MediaInterface} from "../types";
import {v4 as uuid} from "uuid";
import {IMediaCompressionService} from "./MediaCompressionService";
import axios from "axios";

export interface IMediaService extends IServiceInterface {
    upload(data: UploadMediaRequest): Promise<string>;
    create(data: CreateMediaRequest): Promise<MediaInterface>;
    save(externalURL: string, filename: string, folder: string): Promise<string>;
    uploadBuffer(buffer: Buffer, fileName: string, targetFolder: string, mimetype: string): Promise<string>
    extractTypeFromMimetype(mimetype: string): string
}

export interface MediaUploadRequest {
    uuid: string
    filename: string
}

export interface MediaUploadResponse {
    url: string
    filename: string
}

@singleton()
class MediaService extends Service implements IMediaService {

    private storage = new Storage({ keyFilename: 'prf-d-pwa-8b7a.json' })
    private bucket = this.storage.bucket('ddt-app')

    public extractTypeFromMimetype(mimetype: string): string {
        const mimeType = mimetype.toLowerCase();

        // Check mimetype using switch
        switch (true) {
            case mimetype.toLowerCase().startsWith('image/'):
                return 'Image';

            case mimetype.toLowerCase().startsWith('video/'):
                return 'Video';

            case mimetype.toLowerCase().startsWith('application/') || mimeType.startsWith('text/'):
                return 'File';

            default: return 'Image';
        }
    }

    public save = async (externalURL: string, filename: string, folder: string) => {
        try {
            const response = await axios.get(externalURL, {
                responseType: 'arraybuffer'
            });
            const buffer = Buffer.from(response.data);
            return await this.uploadBuffer(buffer, filename, folder);
        } catch (error: any) {
            throw new Error(`Failed to save MP3: ${error.message}`);
        }
    }

    public create = async (data: CreateMediaRequest) => {
        const media =  await this.db.media.create({
            data: data
        })

        return {
            id: media.id,
            url: media.url,
            type: media.type
        }
    }

    public upload = async (data: UploadMediaRequest) => {
        console.log('starting upload process')

        const buffer = await this.compressFile(data.file)

        console.log('compressed file')

        let filename: string

        // TODO: Temporary fix to handle both video and image files for notes
        if(data.purpose === 'note.attachment') {
            filename = data.file.mimetype.toLowerCase().startsWith('image') ? `${data.file.filename}.webp` : `${data.file.filename}.mp4`
        } else {
            filename = await this.getFilenameByPurpose(data.purpose)
        }

        console.log('saving to bucket')

        await this.bucket
            .file(`${data.uuid}/${filename}`)
            .save(buffer, {
                metadata: {
                    cacheControl: 'public, max-age=31536000'
                }
            })

        const [url] = await this.bucket
            .file(`${data.uuid}/${filename}`)
            .getSignedUrl({
                action: 'read',
                expires: '01-01-2050',
            });

        return url
    }

    public uploadBuffer = async (buffer: Buffer, fileName: string, targetFolder: string, mimetype = 'audio/mpeg') => {
        const destination = `${targetFolder}/${fileName}`;

        await this.bucket
            .file(destination)
            .save(buffer, {
                contentType: mimetype
            });

        const [url] = await this.bucket
            .file(destination)
            .getSignedUrl({
                action: 'read',
                expires: '01-01-2050',
            });

        return url
    }

    private async compressFile(file: Express.Multer.File): Promise<Buffer> {
        const mediaCompressionService = container.resolve<IMediaCompressionService>("MediaCompressionService")

        switch (true) {
            case file.mimetype.startsWith('audio'): return await mediaCompressionService.audio(file.path);
            case file.mimetype.startsWith('video'): return await mediaCompressionService.video(file.path);
            case file.mimetype.startsWith('image'): return await mediaCompressionService.image(file.path);
            default: throw new Error(`Unsupported file type: ${file.mimetype}`);
        }
    }

    private async getFilenameByPurpose(purpose: ProcessAttachmentRequest['purpose']) {
        switch (purpose) {
            case "track.audio": return 'audio.mp3'
            case "track.cover": return 'cover.webp'
            case "track.video": return 'video.mp4'
            case "user.avatar": return 'avatar.webp'
            case "user.banner": return 'banner.webp'
            case "note.attachment": return 'banner.webp'
            default: return uuid()
        }
    }
}

MediaService.register()