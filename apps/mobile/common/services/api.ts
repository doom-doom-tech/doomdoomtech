import axios, {AxiosError, InternalAxiosRequestConfig} from "axios";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";

// export const API_BASE_URL = "http://192.168.2.2:8080";
export const API_BASE_URL = "https://api.doomdoom.tech";

export const STORAGE_KEYS = {
	PAYMENTS_IDENTIFIER: "Payments.AppUserID",
	SESSION: "Session.ID",
	DEVICE: "Device.ID",
	AUTH: "Auth.accessToken",
	FEED: "Feed.Ordering",
} as const;

const api = axios.create({
	baseURL: API_BASE_URL,
	timeout: 60000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

// Store a promise to track ongoing session refresh
let refreshPromise: Promise<void> | null = null;

api.interceptors.request.use(
	async (config: InternalAxiosRequestConfig<any>) => {
		const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH);
		if (accessToken) config.headers.setAuthorization(accessToken);

		config.headers.set("x-session-id", await AsyncStorage.getItem(STORAGE_KEYS.SESSION));
		config.headers.set("x-device-id", Device.modelId);

		return config;
	},
	(error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		if (error.response?.status === 440) {
			try {
				// If a refresh is already in progress, wait for it
				if (refreshPromise) {
					await refreshPromise;
					// Retry the original request with the new session
					return api(error.config!);
				}

				// Start a new refresh
				refreshPromise = refreshSession();
				await refreshPromise;

				// Retry the original request with the new session
				return api(error.config!);
			} catch (refreshError) {
				// Handle refresh failure (e.g., log out user or redirect)
				console.error("Session refresh failed:", refreshError);
				throw refreshError;
			} finally {
				// Clear the refresh promise
				refreshPromise = null;
			}
		}

		// For non-440 errors, reject as is
		throw error;
	}
);

const refreshSession = async () => {
	try {
		// Delete the current session
		await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);

		// Create a new session
		const response = await api.post("/session/create");
		const newSessionId = response.headers["x-session-id"];
		if (!newSessionId) {
			throw new Error("No session ID returned from server");
		}

		// Store the new session ID
		await AsyncStorage.setItem(STORAGE_KEYS.SESSION, newSessionId);

	} catch (error) {
		console.error("Failed to refresh session:", error);
		throw error;
	}
};

export default api;