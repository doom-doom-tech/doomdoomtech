import {S3Client} from "@aws-sdk/client-s3";
import {Upload} from "@aws-sdk/lib-storage";
import {singleton} from "tsyringe";
import {container} from "../../../common/utils/tsyringe";
import Service, {IServiceInterface} from "../../../common/services/Service";
import {CreateMediaRequest, ProcessAttachmentRequest, UploadMediaRequest} from "../types/requests";
import {MediaInterface} from "../types";
import {v4 as uuid} from "uuid";
import axios from "axios";
import fs from "fs/promises";
import {IQueue} from "../../../common/types";
import {SimpleIDInterface} from "doomdoomtech/common/types/common"; // Node.js fs module for reading files

export interface IMediaService extends IServiceInterface {
    upload(data: UploadMediaRequest): Promise<string>;
    create(data: CreateMediaRequest): Promise<MediaInterface>;
    delete(data: SimpleIDInterface): Promise<void>;
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

    private s3Client = new S3Client({
        endpoint: 'https://ams3.digitaloceanspaces.com',
        region: 'ams3',
        credentials: {
            accessKeyId: process.env.SPACES_KEY as string,
            secretAccessKey: process.env.SPACES_SECRET as string
        }
    })

    private bucketName = 'ddt'

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

        const filePath = data.file.path; // Multer provides the path to the file on disk
        const mimetype = data.file.mimetype;

        const fileBuffer = await fs.readFile(data.file.path);

        console.log('preparing file for upload')

        let filename: string

        // TODO: Temporary fix to handle both video and image files for notes
        if(data.purpose === 'note.attachment') {
            filename = data.file.mimetype.toLowerCase().startsWith('image') ? `${data.file.filename}.webp` : `${data.file.filename}.mp4`
        } else {
            filename = await this.getFilenameByPurpose(data.purpose)
        }

        console.log('saving to bucket')

        const key = `${data.uuid}/${filename}`

        const upload = new Upload({
            client: this.s3Client,
            params: {
                Bucket: this.bucketName,
                Key: key,
                Body: fileBuffer,
                ContentType: data.file.mimetype,
                ACL: 'public-read'
            }
        })

        await upload.done()

        await fs.unlink(filePath).catch((err) => {
            console.error(`Failed to delete temporary file ${filePath}: ${err.message}`);
        });

        // Queue async compression job
        const mediaCompressionQueue = container.resolve<IQueue>("MediaCompressionQueue")
        mediaCompressionQueue.addJob('compress', {
            uuid: data.uuid,
            filename: filename,
            purpose: data.purpose
        })

        const url = `https://${this.bucketName}.ams3.digitaloceanspaces.com/${key}`

        // Return the URL of the uncompressed file
        return url
    }

    public delete = async (data: SimpleIDInterface) => {
        await this.db.media.deleteMany({
            where: {
                id: data.id
            }
        })
    }

    public uploadBuffer = async (buffer: Buffer, fileName: string, targetFolder: string, mimetype = 'audio/mpeg') => {
        const key = `${targetFolder}/${fileName}`;

        // Ensure buffer is a proper Buffer object
        const properBuffer = Buffer.from(buffer);

        const upload = new Upload({
            client: this.s3Client,
            params: {
                Bucket: this.bucketName,
                Key: key,
                Body: properBuffer,
                ContentType: mimetype,
                ACL: 'private'
            }
        });

        await upload.done();

        // Return the URL of the file
        const url = `https://${this.bucketName}.ams3.digitaloceanspaces.com/${key}`;

        return url
    }

    private async getFilenameByPurpose(purpose: ProcessAttachmentRequest['purpose']) {
        switch (purpose) {
            case "track.audio": return 'audio.mp3'
            case "track.cover": return 'cover.webp'
            case "track.video": return 'video.mp4'
            case "user.avatar": return 'avatar.webp'
            case "user.banner": return 'banner.webp'
            default: return uuid()
        }
    }
}

MediaService.register()
