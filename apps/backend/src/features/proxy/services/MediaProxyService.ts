import crypto from 'crypto';
import _ from "lodash";
import {injectable} from "tsyringe";
import {IServiceInterface, Service} from "../../../common/services/Service";

type MediaURLObject = {
    [key: string]: any;
};

interface EncryptedData {
    url: string;
    expirationTimestamp: number;
}

interface URLFieldMapping {
    fieldName: string;
    type: string;
}

type MediaType = 'image' | 'video' | 'audio' | 'unknown';

export interface IProxyService extends IServiceInterface {
    /**
     * Proxies the media URLs of a single entity and adds media type metadata.
     * @param entity - The entity containing media URLs to be proxied.
     * @param entityType - The type of entity, corresponding to predefined entity mappings.
     * @returns The entity with proxied URLs and media type metadata.
     */
    proxyMediaURLs<T extends MediaURLObject>(
        entity: T,
        entityType: MediaType
    ): T;

    /**
     * Proxies the media URLs for an array of entities and adds media type metadata.
     * @param entities - Array of entities containing media URLs to be proxied.
     * @param entityType - The type of entity, corresponding to predefined entity mappings.
     * @returns An array of entities with proxied URLs and media type metadata.
     */
    proxyBulkMediaURLs<T extends MediaURLObject>(
        entities: T[],
        entityType: MediaType
    ): T[];

    /**
     * Decrypts a hashed string back to its original URL if it hasn't expired.
     * @param hash - The encrypted hash to decrypt.
     * @returns The original URL if valid and unexpired, or `null` if invalid.
     */
    decryptHash(hash: string): string | null;
}

@injectable()
export class MediaProxyService extends Service implements IProxyService {

    private readonly encryptionKey: Buffer;
    private readonly ivLength: number = 16;
    private readonly API_BASE_URL: string;
    private readonly expirationTime: number;

    private readonly mediaTypePatterns = {
        image: /\.(jpg|jpeg|png|gif|bmp|webp|svg)($|\?)/i,
        video: /\.(mp4|webm|mov|avi|wmv|flv|mkv)($|\?)/i,
        audio: /\.(mp3|wav|ogg|m4a|aac)($|\?)/i
    };

    private readonly entityURLMappings: Record<string, URLFieldMapping[]> = {
        track: [
            { fieldName: 'cover_url', type: 'c' },
            { fieldName: 'audio_url', type: 'a' },
            { fieldName: 'waveform_url', type: 'w' }
        ],
        user: [
            { fieldName: 'avatar_url', type: 'i' },
            { fieldName: 'banner_url', type: 'i' }
        ],
    };

    constructor() {
        super()

        if (!process.env.MEDIA_PROXY_KEY || !process.env.BASE_URL) {
            throw new Error('Missing required environment variables: MEDIA_PROXY_KEY or BASE_URL');
        }

        this.encryptionKey = crypto
            .createHash('sha256')
            .update(process.env.MEDIA_PROXY_KEY)
            .digest();

        this.API_BASE_URL = process.env.BASE_URL.replace(/\/$/, '');
        this.expirationTime = 3600;
    }

    public proxyMediaURLs<T extends MediaURLObject>(
        entity: T,
        entityType: keyof typeof this.entityURLMappings
    ): T {
        const mappings = this.entityURLMappings[entityType];
        if (!mappings) return entity;

        const result = { ...entity };

        for (const mapping of mappings) {
            const value = _.get(entity, mapping.fieldName);
            if (value) {
                // Get the base field name without any path
                const baseFieldName = mapping.fieldName.split('.').pop() as string;

                // Create the media type field name
                const mediaTypeField = `${baseFieldName}_type`;

                // Set the proxied URL
                _.set(result, mapping.fieldName, this.createProxyURL(mapping.type, value));

                // Set the media type
                _.set(result, mediaTypeField, this.detectMediaType(value));
            }
        }

        return result;
    }

    public proxyBulkMediaURLs<T extends MediaURLObject>(
        entities: T[],
        entityType: keyof typeof this.entityURLMappings
    ): T[] {
        return entities.map(entity => this.proxyMediaURLs(entity, entityType));
    }

    public decryptHash(hash: string): string | null {
        try {
            const base64 = this.base64UrlToBase64(hash);
            const buffer = Buffer.from(base64, 'base64');

            const iv = buffer.subarray(0, this.ivLength);
            const encrypted = buffer.subarray(this.ivLength);

            // @ts-ignore
            const decipher = crypto.createDecipheriv("aes-256-ccm", this.encryptionKey, iv);

            // @ts-ignore
            let decrypted = decipher.update(encrypted);

            // @ts-ignore
            decrypted = Buffer.concat([decrypted, decipher.final()]);

            const data: EncryptedData = JSON.parse(decrypted.toString('utf8'));

            if (data.expirationTimestamp < Math.floor(Date.now() / 1000)) {
                return null;
            }

            return data.url;
        } catch (error) {
            return null;
        }
    }

    private detectMediaType(url: string): MediaType {
        if (this.mediaTypePatterns.image.test(url)) {
            return 'image';
        }
        if (this.mediaTypePatterns.video.test(url)) {
            return 'video';
        }
        if (this.mediaTypePatterns.audio.test(url)) {
            return 'audio';
        }
        return 'unknown';
    }

    private encryptURL(url: string): string {
        const iv = crypto.randomBytes(this.ivLength);

        // @ts-ignore
        const cipher = crypto.createCipheriv('aes-256-ccm',
            this.encryptionKey,
            iv
        );

        const data: EncryptedData = {
            url,
            expirationTimestamp: Math.floor(Date.now() / 1000) + this.expirationTime
        };

        // Encrypt the data
        const jsonData = JSON.stringify(data);
        // @ts-ignore
        const encrypted = Buffer.concat([
            // @ts-ignore
            cipher.update(Buffer.from(jsonData, 'utf8')),
            // @ts-ignore
            cipher.final()
        ]);

        // @ts-ignore
        const combined = Buffer.concat([iv, encrypted]);

        // Convert to URL-safe base64
        return this.base64ToBase64Url(combined.toString('base64'));
    }

    private createProxyURL(type: string, originalURL: string): string {
        const hash = this.encryptURL(originalURL);
        return `${this.API_BASE_URL}/media/${type}/${hash}`;
    }

    private base64ToBase64Url(base64: string): string {
        return base64
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    private base64UrlToBase64(base64url: string): string {
        base64url = base64url.replace(/-/g, '+').replace(/_/g, '/');
        const pad = base64url.length % 4;
        if (pad) {
            base64url += '='.repeat(4 - pad);
        }
        return base64url;
    }
}