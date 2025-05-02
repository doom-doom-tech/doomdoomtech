import axios, {AxiosError, InternalAxiosRequestConfig} from "axios";
import * as Device from 'expo-device'
import AsyncStorage from "@react-native-async-storage/async-storage";

// export const API_BASE_URL = 'http://192.168.2.23:8080'
export const API_BASE_URL = 'https://api.doomdoom.tech'
// export const API_BASE_URL = 'https://10.101.8.162:8080'

export const STORAGE_KEYS = {
	PAYMENTS_IDENTIFIER: 'Payments.AppUserID',
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
		const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH);
		if (accessToken) config.headers.setAuthorization(accessToken);

		config.headers.set('x-session-id', await AsyncStorage.getItem(STORAGE_KEYS.SESSION));
		config.headers.set('x-device-id', Device.modelId);

		return config;
	},
	(error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
	async (response) => {
		return response;
	},
	async (error: AxiosError) => {
		return Promise.reject(error);
	}
);

export default api;