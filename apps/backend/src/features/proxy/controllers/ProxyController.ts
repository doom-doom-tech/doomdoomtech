import {NextFunction, Request, Response} from 'express';
import {formatErrorResponse} from '../../../common/utils/responses';
import axios from 'axios';
import {ParamsDictionary} from 'express-serve-static-core';
import {MediaProxyService} from "../services/MediaProxyService";
import https from 'https';
import {Readable} from 'stream';
import Controller from "../../../common/controllers/Controller";
import {singleton} from "tsyringe";

interface MediaProxyParams extends ParamsDictionary {
    type: string;
    hash: string;
}

interface ProxyStreamResponse {
    stream: Readable;
    headers: Record<string, string>;
    statusCode: number;
}

export interface IMediaProxyController {
    handleProxyRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
}

@singleton()
export class ProxyController extends Controller implements IMediaProxyController {

    private readonly validTypes = ['c', 'a', 'w', 'i'];
    private readonly httpsAgent: https.Agent;

    private readonly streamableTypes = [
        'video/mp4',
        'audio/mpeg',
        'audio/mp4',
        'video/webm'
    ];

    private readonly imageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml'
    ];

    private readonly CHUNK_SIZE = 1024 * 1024;

    constructor(private readonly mediaProxy: MediaProxyService) {
        super()
        this.httpsAgent = new https.Agent({
            rejectUnauthorized: true,
            keepAlive: true,
            timeout: 60000,
            maxSockets: 100,
            maxFreeSockets: 10,
            maxCachedSessions: 100,
            minVersion: 'TLSv1.2',
            maxVersion: 'TLSv1.3',
            ciphers: [
                'TLS_AES_128_GCM_SHA256',
                'TLS_AES_256_GCM_SHA384',
                'TLS_CHACHA20_POLY1305_SHA256',
                'ECDHE-ECDSA-AES128-GCM-SHA256',
                'ECDHE-RSA-AES128-GCM-SHA256',
                'ECDHE-ECDSA-AES256-GCM-SHA384',
                'ECDHE-RSA-AES256-GCM-SHA384'
            ].join(':'),
        });
    }

    public handleProxyRequest = async (
        req: Request<MediaProxyParams>,
        res: Response
    ): Promise<void> => {
        try {
            const { type, hash } = req.params;

            if (!this.validTypes.includes(type)) {
                res.status(400).json(formatErrorResponse('Invalid media type'));
                return;
            }

            const originalURL = this.mediaProxy.decryptHash(hash);
            if (!originalURL) {
                res.status(400).json(formatErrorResponse('Invalid or expired URL'));
                return;
            }

            const streamResponse = await this.prepareProxyStream(originalURL, req.headers.range);

            // Set headers
            res.writeHead(streamResponse.statusCode, streamResponse.headers);

            // Handle stream errors
            streamResponse.stream.on('error', (error: Error) => {
                if (!res.headersSent) {
                    res.status(500).send('Streaming error occurred');
                }
                streamResponse.stream.destroy();
            });

            // Monitor for client disconnect
            req.on('close', () => {
                streamResponse.stream.destroy();
            });

            // Pipe the stream to response
            streamResponse.stream.pipe(res);

        } catch (error) {
            this.handleProxyError(error, res);
        }
    };

    private async getFileMetadata(url: string): Promise<{ contentType: string; fileSize: number }> {
        try {
            // First try with a GET request and cancel it after receiving headers
            const controller = new AbortController();
            const response = await axios.get(url, {
                httpsAgent: this.httpsAgent,
                signal: controller.signal,
                responseType: 'stream',
                headers: {
                    'Accept': '*/*',
                    'User-Agent': 'MediaProxyService/1.0',
                    'Range': 'bytes=0-0' // Request just the first byte
                },
                maxRedirects: 5,
                validateStatus: (status) => status < 400,
                timeout: 30000,
            });

            // Abort the request after getting headers
            controller.abort();

            const contentType = response.headers['content-type'];
            const contentLength = response.headers['content-length'];
            const contentRange = response.headers['content-range'];

            // If we have a content-range header, use it to get the total size
            let fileSize = 0;
            if (contentRange) {
                const match = contentRange.match(/bytes \d+-\d+\/(\d+)/);
                if (match) {
                    fileSize = parseInt(match[1], 10);
                }
            } else {
                fileSize = parseInt(contentLength || '0');
            }

            if (!contentType || !fileSize) {
                throw new Error('Invalid content type or file size');
            }

            return { contentType, fileSize };
        } catch (error) {
            console.error('Error getting file metadata:', error);
            throw error;
        }
    }

    private async prepareProxyStream(url: string, range?: string): Promise<ProxyStreamResponse> {
        try {
            // Get file metadata
            const { contentType, fileSize } = await this.getFileMetadata(url);

            // Calculate stream range
            let start = 0;
            let end = fileSize - 1;

            if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                start = parseInt(parts[0], 10);
                end = parts[1]
                    ? parseInt(parts[1], 10)
                    : Math.min(start + this.CHUNK_SIZE, fileSize - 1);

                if (isNaN(start) || isNaN(end) || start >= fileSize || end >= fileSize || start > end) {
                    throw new Error('Invalid range');
                }
            }

            // Create stream
            const response = await axios({
                method: 'get',
                url: url,
                responseType: 'stream',
                httpsAgent: this.httpsAgent,
                maxRedirects: 5,
                validateStatus: (status) => status < 400,
                timeout: 30000,
                headers: {
                    'Accept': '*/*',
                    'User-Agent': 'MediaProxyService/1.0',
                    ...(range ? { Range: `bytes=${start}-${end}` } : {})
                }
            });

            // Generate headers
            const headers = {
                'Accept-Ranges': 'bytes',
                'Content-Length': (end - start + 1).toString(),
                'Content-Type': contentType,
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
                'Access-Control-Allow-Headers': 'Range, Content-Type, Accept, Content-Length',
                'Access-Control-Expose-Headers': 'Content-Range, Accept-Ranges, Content-Length, Content-Type',
                'Cache-Control': 'no-store, no-cache, must-revalidate, private',
                'Pragma': 'no-cache'
            };

            if (this.streamableTypes.includes(contentType)) {
                // @ts-ignore
                headers['X-Content-Type-Options'] = 'nosniff';
            }

            return {
                stream: response.data as Readable,
                headers,
                statusCode: range ? 206 : 200
            };

        } catch (error) {
            console.error('Proxy stream preparation error:', error);
            throw error;
        }
    }

    private handleProxyError(error: unknown, res: Response): void {
        console.error('Media proxy error:', error);

        if (axios.isAxiosError(error)) {
            switch (error.response?.status) {
                case 404:
                    res.status(404).json(formatErrorResponse('Media not found'));
                    break;
                case 403:
                    res.status(403).json(formatErrorResponse('Access denied'));
                    break;
                case 415:
                    res.status(415).json(formatErrorResponse('Unsupported media type'));
                    break;
                default:
                    res.status(500).json(formatErrorResponse('Error fetching media'));
            }
            return;
        }

        if (error instanceof Error) {
            switch (error.message) {
                case 'Invalid range':
                    res.status(416).json(formatErrorResponse('Requested range not satisfiable'));
                    break;
                case 'Invalid content type or file size':
                    res.status(500).json(formatErrorResponse('Error processing media file'));
                    break;
                case 'Invalid file size':
                    res.status(500).json(formatErrorResponse('Error processing media file'));
                    break;
                default:
                    res.status(500).json(formatErrorResponse('Error serving media'));
            }
            return;
        }

        res.status(500).json(formatErrorResponse('Unknown error occurred'));
    }
}

ProxyController.register()