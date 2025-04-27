import {useCallback} from 'react';
import * as Device from 'expo-device';
import {Platform} from "react-native";
import api from "@/common/services/api";
import {RegisterDeviceRequest} from "@/features/device/types/requests";
import * as Notifications from "expo-notifications";

const connectUser = async (data: Partial<RegisterDeviceRequest>) => {
	await api.post("/device/register", data);
}

export const useConnectUserDevice = () => {
	return useCallback(async (userID: number) => {
		try {
			if (Device.isDevice) {
				const pushTokenResponse = await Notifications.getExpoPushTokenAsync({
					projectId: "fdd82ade-643f-4899-8a37-1e9821d4900c",
				});

				const deviceTokenString = (await Notifications.getDevicePushTokenAsync()).data;
				const pushTokenString = pushTokenResponse.data;

				await connectUser({
					userID: userID,
					platform: Platform.OS,
					push_token: pushTokenString,
					device_token: deviceTokenString,
					expo_device_id: `${Device.deviceName}-${Device.modelName}`
				});
			}
		} catch (error) {
			console.error('Error connecting user device:', error);
		}
	}, []);
}