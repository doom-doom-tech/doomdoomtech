import {S3Client} from '@aws-sdk/client-s3';
import {Upload} from '@aws-sdk/lib-storage';
import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import {randomUUID} from 'crypto';
import {tmpdir} from 'os';
import {readFile, unlink, writeFile} from 'fs/promises';
import {https} from 'firebase-functions/v2';
import {defineString} from 'firebase-functions/params';

/*───────────────────────────────────────────────────────────*/
/*  Config                                                  */
/*───────────────────────────────────────────────────────────*/

const SPACES_KEY = defineString('SPACES_KEY');
const SPACES_SECRET = defineString('SPACES_SECRET');
const BUCKET_NAME = 'ddt';                      // DigitalOcean Spaces bucket

ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');          // use runtime FFmpeg

/*───────────────────────────────────────────────────────────*/
/*  Helpers                                                 */

/*───────────────────────────────────────────────────────────*/

async function downloadAudio(url: string): Promise<string> {
    console.log('[download] GET', url);
    const res = await axios.get<ArrayBuffer>(url, {responseType: 'arraybuffer'});
    if (res.status !== 200) {
        throw new Error(`download ${url} → ${res.status}`);
    }
    const file = `${tmpdir()}/${randomUUID()}.src`;
    await writeFile(file, Buffer.from(res.data));
    console.log('[download] saved to', file);
    return file;
}

async function processAudio(
    inputFile: string,
    start: number,
    duration: number
): Promise<Buffer> {
    console.log('[ffmpeg] cut', inputFile, `@${start}s for ${duration}s`);
    const outFile = `${tmpdir()}/${randomUUID()}.mp3`;

    return new Promise((resolve, reject) => {
        ffmpeg(inputFile)
            .setStartTime(start)        // -ss
            .setDuration(duration)      // -t
            .audioCodec('libmp3lame')
            .audioBitrate('128k')
            .audioChannels(2)
            .audioFrequency(44100)
            .format('mp3')
            .addInputOption('-loglevel', 'error') // noise-free logs; change to 'debug' if needed
            .on('start', cmd => console.log('[ffmpeg cmd]', cmd))
            .on('stderr', line => console.log('[ffmpeg]', line))
            .on('error', reject)
            .on('end', async () => {
                try {
                    const data = await readFile(outFile);
                    await unlink(outFile).catch(() => {
                    });
                    if (data.length === 0) {
                        return reject(new Error('FFmpeg produced no output'));
                    }
                    resolve(data);
                } catch (err) {
                    reject(err);
                }
            })
            .save(outFile);
    });
}

async function uploadToSpaces(buffer: Buffer, key: string): Promise<void> {
    console.log('[spaces] upload', key, `(${buffer.length} bytes)`);

    const s3 = new S3Client({
        endpoint: 'https://ams3.digitaloceanspaces.com',
        region: 'ams3',
        credentials: {
            accessKeyId: SPACES_KEY.value(),
            secretAccessKey: SPACES_SECRET.value()
        }
    });

    const upload = new Upload({
        client: s3,
        params: {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: 'audio/mpeg',
            ACL: 'public-read'
        }
    });

    await upload.done();
    console.log('[spaces] upload complete');
}

/*───────────────────────────────────────────────────────────*/
/*  HTTPS entry point                                       */
/*───────────────────────────────────────────────────────────*/

export const sampleAudio = https.onRequest(
    {
        memory: '2GiB',          // plenty for FFmpeg
        timeoutSeconds: 540      // max for gen-2 HTTP functions
    },
    async (req: any, res: any) => {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        const {audioURL, startTime, sampleDuration, trackUUID} = req.body ?? {};
        if (!audioURL || startTime == null || !sampleDuration || !trackUUID) {
            return res
                .status(400)
                .send('Missing required parameters: audioURL, startTime, sampleDuration, trackUUID');
        }

        let localSrc = '';
        try {
            /* 1  Download to /tmp */
            localSrc = await downloadAudio(audioURL);

            /* 2  Slice & encode */
            const buffer = await processAudio(localSrc, startTime, sampleDuration);

            /* 3  Upload */
            const key = `${trackUUID}/sample.mp3`;
            await uploadToSpaces(buffer, key);

            /* 4  Respond with public URL */
            const url = `https://${BUCKET_NAME}.ams3.digitaloceanspaces.com/${key}`;
            res.status(200).send({url});
        } catch (err: any) {
            console.error('[handler] error:', err);
            res.status(500).send({error: err?.message ?? 'Unknown error'});
        } finally {
            if (localSrc) await unlink(localSrc).catch(() => {
            });
        }
    }
);