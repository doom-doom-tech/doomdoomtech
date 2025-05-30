import {useCallback} from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {Platform} from "react-native";
import {RegisterDeviceRequest} from "@/features/device/types/requests";
import api from "@/common/services/api";

const connectUser = async (data: Partial<RegisterDeviceRequest>) => {
	await api.post("/device/register", data);
};

export const useConnectUserDevice = () => {
	return useCallback(async (userID: number) => {
		try {
			if (!Device.isDevice) return;

			const pushTokenResponse = await Notifications.getExpoPushTokenAsync({
				projectId: "fdd82ade-643f-4899-8a37-1e9821d4900c",
			});

			const deviceToken = (await Notifications.getDevicePushTokenAsync())?.data;
			const pushToken = pushTokenResponse.data;
			const expoDeviceID = `${Device.deviceName}-${Device.modelName}`;

			await connectUser({
				userID,
				push_token: pushToken,
				device_token: deviceToken,
				expo_device_id: expoDeviceID,
				platform: Platform.OS,
			});
		} catch (error) {
			console.error("Error connecting user device:", error);
		}
	}, []);
};