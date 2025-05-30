import {S3Client} from '@aws-sdk/client-s3';
import {Upload} from '@aws-sdk/lib-storage';
import ffmpeg from 'fluent-ffmpeg';
import {PassThrough} from 'stream';
import {Buffer} from 'buffer';
import {https} from 'firebase-functions/v2';
import {defineString} from 'firebase-functions/params';

const SPACES_KEY = defineString('SPACES_KEY');
const SPACES_SECRET = defineString('SPACES_SECRET');
const BUCKET_NAME = 'ddt';

ffmpeg.setFfmpegPath('/usr/bin/ffmpeg'); // Use system ffmpeg in Firebase

async function extractAudio(videoURL: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const passThrough = new PassThrough();
        const buffers: Buffer[] = [];

        passThrough.on('data', (chunk: Buffer) => buffers.push(chunk));
        passThrough.on('error', (err) => reject(err));
        passThrough.on('end', () => resolve(Buffer.concat(buffers)));

        ffmpeg(videoURL)
            .noVideo()
            .audioCodec('libmp3lame')
            .audioBitrate('128k')
            .audioChannels(2)
            .audioFrequency(44100)
            .format('mp3')
            .on('start', (cmd) => console.log('FFmpeg started:', cmd))
            .on('progress', (p) => console.log(`Processing: ${p.percent?.toFixed(2)}%`))
            .on('error', (err) => reject(err))
            .on('end', () => console.log('FFmpeg extraction finished'))
            .pipe(passThrough, { end: true });
    });
}

async function uploadToSpaces(buffer: Buffer, key: string): Promise<void> {
    const s3Client = new S3Client({
        endpoint: 'https://ams3.digitaloceanspaces.com',
        region: 'ams3',
        credentials: {
            accessKeyId: SPACES_KEY.value(),
            secretAccessKey: SPACES_SECRET.value()
        }
    });

    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: 'audio/mpeg',
            ACL: 'public-read'
        }
    });

    await upload.done();
    console.log('Upload complete:', key);
}

export const extractAudioFromVideo = https.onRequest(
    {
        memory: '2GiB',
        timeoutSeconds: 540,
    },
    async (req: any, res: any) => {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        const { videoURL, trackUUID } = req.body ?? {};
        if (!videoURL || !trackUUID) {
            return res.status(400).send('Missing required parameters: videoURL, trackUUID');
        }

        try {
            const audioBuffer = await extractAudio(videoURL);
            const key = `${trackUUID}/audio.mp3`;

            await uploadToSpaces(audioBuffer, key);

            const url = `https://${BUCKET_NAME}.ams3.digitaloceanspaces.com/${key}`;
            return res.status(200).send({ url });
        } catch (error: any) {
            console.error('Error extracting audio:', error);
            return res.status(500).send({ error: error.message || 'Unknown error' });
        }
    }
);