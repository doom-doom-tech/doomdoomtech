import Redis from 'ioredis';
import {singleton} from "tsyringe";

export interface IRedis {
    getClient(): Redis;
}

@singleton()
export default class RedisClient {
    private static instance: Redis;

    public static getClient(): Redis {
        if (!RedisClient.instance) {
            RedisClient.instance = new Redis({
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

            RedisClient.instance.on('error', (err) => console.error('Redis Client Error', err));
            RedisClient.instance.on('connect', () => console.log('Connected to Redis'));
        }

        return RedisClient.instance;
    }
}