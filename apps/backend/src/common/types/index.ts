import {BaseJobOptions, Job, RepeatOptions} from "bullmq";

export type TODO = any

export interface DateRange {
    startDate: Date | null;
    endDate: Date;
}

export type FormData<T> = {
    [K in keyof T]: string;
};

export interface EntityInterface {
    type: 'Note' | 'Track' | 'Album'
}

export interface SearchQueryInterface {
    query?: string
}

export interface WithFile {
    file: Express.Multer.File
}

export interface WithFiles {
    files: Array<Express.Multer.File>
}

export interface IJob<T = any> {
    process(job: Job<T>): Promise<void>;
}


export interface IQueue {
    addJob<T>(name: string, data: T, options?: BaseJobOptions): Promise<Job<T>>;
    removeRepeatable(name: string, options: RepeatOptions): Promise<unknown>
    initialize(): Promise<void>
    close(): Promise<void>
}


export interface IWorker {
    initialize(): Promise<void>
    close(): Promise<void>
}