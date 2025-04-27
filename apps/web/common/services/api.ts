import axios, {AxiosError, InternalAxiosRequestConfig} from "axios";

export const API_BASE_URL = 'https://api.doomdoom.tech'

export const STORAGE_KEYS = {
    SESSION: 'Session.ID',
    DEVICE: 'Device.ID',
    AUTH: 'Auth.accessToken',
    FEED: 'Feed.Ordering'
} as const;

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig<any>) => {
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
    async (response) => {
        return response;
    },
    async (error: AxiosError) => {
        console.log(JSON.stringify(error))
        return Promise.reject(error);
    }
);

export default api;