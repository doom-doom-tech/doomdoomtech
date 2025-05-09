import Redis from "ioredis";
import express from 'express';
import {Job, Worker} from 'bullmq';
import compress, {CompressMediaRequest} from "./compress";

require('dotenv').config()

const app = express();
const port = 3000;

const redis = new Redis({
	host: process.env.REDIS_HOST,
	port: parseInt(process.env.REDIS_PORT || '6379', 10),
	password: process.env.REDIS_PASSWORD,
	maxRetriesPerRequest: null,
	retryStrategy: (times) => {
		if (times > 3) {
			console.error('Redis connection failed after 3 attempts');
			return null;
		}
		return Math.min(times * 100, 3000);
	},
});

redis.on('error', (err) => console.error('Redis Client Error', err));
redis.on('connect', () => console.log('Connected to Redis'));

const worker = new Worker(
	"MediaCompressionQueue",
	async (job: Job<CompressMediaRequest>) => {
		if (job.name === "compress") compress(job.data)
	},
	{
		connection: redis,
		concurrency: 2
	}
);

// Error handling
worker.on('failed', (job, err) => {
	console.error(`Job ${job?.id || 'unknown'} failed with error:`, err);
});

worker.on('error', err => {
	console.error('Worker error:', err);
});

// Basic Express setup
app.use(express.json());

app.get('/', (req, res) => {
	res.send('BullMQ Worker is running');
});

// Start server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
	await worker.close();
	process.exit(0);
});
