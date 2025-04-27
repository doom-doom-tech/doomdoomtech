// stream.service.ts
import {File, Storage} from '@google-cloud/storage';
import EntityNotFoundError from "../../../common/classes/errors/EntityNotFoundError";
import NodeCache from "node-cache";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";

interface CloudFile {
    bucket: string;
    path: string;
}

interface TrackMedia {
    url: string;
    isVideo: boolean;
    contentType: string;
    fileSize?: number;
}

interface StreamResponse {
    stream: NodeJS.ReadableStream;
    headers: Record<string, string>;
    statusCode: number;
}

class StreamService {
    private readonly storage: Storage;
    private readonly cache: NodeCache;
    private readonly CHUNK_SIZE = 1024 * 1024; // 1MB chunks

    constructor(private client: ExtendedPrismaClient) {
        this.storage = new Storage({ keyFilename: 'prf-d-pwa-8b7a.json' });
        this.cache = new NodeCache({
            stdTTL: 3600,
            checkperiod: 600
        });
    }

    public async prepareStream(uuid: string, range?: string): Promise<StreamResponse> {
        try {
            const cacheKey = `track:${uuid}`;
            let media = this.cache.get<TrackMedia>(cacheKey);

            if (!media) {
                media = await this.getTrackMedia(uuid);

                // Get file metadata and update media info
                const cloudFile = this.parseGoogleCloudUrl(media.url);
                const file = this.storage.bucket(cloudFile.bucket).file(cloudFile.path);
                const [metadata] = await file.getMetadata();

                media.fileSize = parseInt(String(metadata.size), 10);
                media.contentType = this.getContentType(cloudFile.path, media.isVideo);

                this.cache.set(cacheKey, media);
            }

            const cloudFile = this.parseGoogleCloudUrl(media.url);
            const file = this.storage.bucket(cloudFile.bucket).file(cloudFile.path);

            if (!media.fileSize) {
                throw new Error('Invalid file size');
            }

            // Handle range request
            const { stream, start, end } = await this.createFileStream(file, range, media.fileSize);

            // Generate headers with proper content type
            const headers = this.generateHeaders({
                start,
                end,
                fileSize: media.fileSize,
                contentType: media.contentType,
                isVideo: media.isVideo
            });

            return {
                stream,
                headers,
                statusCode: range ? 206 : 200
            };
        } catch (error) {
            console.error('Stream preparation error:', error);
            throw error;
        }
    }

    private async createFileStream(file: File, range: string | undefined, fileSize: number) {
        let start = 0;
        let end = fileSize - 1;

        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            start = parseInt(parts[0], 10);
            end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + this.CHUNK_SIZE, fileSize - 1);

            if (isNaN(start) || isNaN(end) || start >= fileSize || end >= fileSize || start > end) {
                throw new Error('Invalid range');
            }
        }

        const stream = file.createReadStream({
            start,
            end,
            validation: false
        });

        return { stream, start, end };
    }

    private generateHeaders({
                                start,
                                end,
                                fileSize,
                                contentType,
                                isVideo
                            }: {
        start: number;
        end: number;
        fileSize: number;
        contentType: string;
        isVideo: boolean;
    }): Record<string, string> {
        const headers: Record<string, string> = {
            'Accept-Ranges': 'bytes',
            'Content-Length': (end - start + 1).toString(),
            'Content-Type': contentType,
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': 'Range, Content-Type, Accept, Content-Length',
            'Access-Control-Expose-Headers': 'Content-Range, Accept-Ranges, Content-Length, Content-Type',
            'Cache-Control': 'public, max-age=3600',
            
        };

        if (isVideo) {
            headers['X-Content-Type-Options'] = 'nosniff';
            headers['Connection'] = 'keep-alive';
        }

        return headers;
    }

    private getContentType(filepath: string, isVideo: boolean): string {
        if (isVideo) {
            if (filepath.endsWith('.mp4')) return 'video/mp4';
            if (filepath.endsWith('.webm')) return 'video/webm';
            return 'video/mp4'; // default video type
        }

        if (filepath.endsWith('.mp3')) return 'audio/mpeg';
        if (filepath.endsWith('.wav')) return 'audio/wav';
        if (filepath.endsWith('.ogg')) return 'audio/ogg';
        return 'audio/mpeg'; // default audio type
    }

    private async getTrackMedia(uuid: string): Promise<TrackMedia> {
        const track = await this.client.track.findFirst({
            where: { uuid, active: true },
            select: {
                audio_url: true,
                cover_url: true
            }
        });

        if (!track) {
            throw new EntityNotFoundError('Track not found');
        }

        if (!track.audio_url && track.cover_url) {
            return {
                url: track.cover_url,
                isVideo: true,
                contentType: 'video/mp4'
            };
        }

        if (track.audio_url) {
            return {
                url: track.audio_url,
                isVideo: false,
                contentType: 'audio/mpeg'
            };
        }

        throw new Error('No media found for track');
    }

    private parseGoogleCloudUrl(urlString: string): CloudFile {
        try {
            const url = new URL(urlString);
            if (url.hostname !== 'storage.googleapis.com') {
                throw new Error('Invalid storage URL');
            }

            const parts = url.pathname.split('/').filter(Boolean);
            if (parts.length < 2) {
                throw new Error('Invalid storage path');
            }

            return {
                bucket: parts[0],
                path: parts.slice(1).join('/')
            };
        } catch (error) {
            console.error('URL parsing error:', error);
            throw new Error('Invalid storage URL format');
        }
    }
}

export default StreamService;