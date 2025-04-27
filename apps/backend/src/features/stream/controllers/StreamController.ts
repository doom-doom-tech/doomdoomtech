import {Request, Response} from 'express';
import {formatErrorResponse} from '../../../common/utils/responses';
import EntityNotFoundError from "../../../common/classes/errors/EntityNotFoundError";
import StreamService from "../services/StreamService";
import Controller from "../../../common/controllers/Controller";
import {inject, singleton} from "tsyringe";

interface StreamRequestParams {
    uuid: string;
}

export interface IStreamController {
    streamMedia(req: Request<StreamRequestParams>, res: Response): Promise<void>;
}

@singleton()
class StreamController extends Controller implements IStreamController {
    constructor(
        @inject("StreamService") private streamService: StreamService
    ) {
        super();
    }

    public streamMedia = async (
        req: Request<StreamRequestParams>,
        res: Response
    ): Promise<void> => {
        try {
            const { uuid } = req.params;

            // Validate UUID format
            if (!this.isValidUUID(uuid)) {
                res.status(400).json(formatErrorResponse('Invalid track UUID'));
                return;
            }

            const streamResponse = await this.streamService.prepareStream(uuid, req.headers.range);

            // Set headers
            res.writeHead(streamResponse.statusCode, streamResponse.headers);

            // Handle stream errors
            streamResponse.stream.on('error', (error: any) => {
                console.error('Stream error:', error);
                if (!res.headersSent) {
                    res.status(500).send('Streaming error occurred');
                }
            });

            // Monitor for client disconnect
            req.on('close', () => {
                streamResponse.stream.removeAllListeners();
            });

            // Pipe the stream to response
            streamResponse.stream.pipe(res);

        } catch (error) {
            this.handleStreamError(error, res);
        }
    };

    private isValidUUID(uuid: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }

    private handleStreamError(error: unknown, res: Response): void {
        console.error('Streaming error:', error);

        if (error instanceof EntityNotFoundError) {
            res.status(404).json(formatErrorResponse('Track not found'));
            return;
        }

        if (error instanceof Error) {
            switch (error.message) {
                case 'Invalid range':
                    res.status(416).json(formatErrorResponse('Requested range not satisfiable'));
                    break;
                case 'Invalid storage URL':
                case 'Invalid storage path':
                case 'Invalid storage URL format':
                    res.status(400).json(formatErrorResponse('Invalid media URL'));
                    break;
                case 'No media found for track':
                case 'Video file not found':
                    res.status(404).json(formatErrorResponse('No media found for track'));
                    break;
                case 'Invalid file size':
                    res.status(500).json(formatErrorResponse('Error processing media file'));
                    break;
                default:
                    res.status(500).json(formatErrorResponse('Error streaming media'));
            }
            return;
        }

        res.status(500).json(formatErrorResponse('Unknown error occurred'));
    }
}

export default StreamController;