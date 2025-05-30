import {useMutation} from "@tanstack/react-query";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {Platform} from "react-native";
import api from "@/common/services/api";

export interface RegisterDeviceRequest {
    userID?: number;
    platform?: "ios" | "android" | "windows" | "macos" | "web";
    push_token?: string;
    device_token?: string;
    expo_device_id: string;
}

let lastDeviceSignature = "";

const registerUserDevice = async (data: RegisterDeviceRequest) => {
    const signature = `${data.expo_device_id}-${data.push_token}`;

    if (signature === lastDeviceSignature) {
        console.log("Device already registered with same data. Skipping.");
        return;
    }

    lastDeviceSignature = signature;
    await api.post("/device/register", data);
};

const useRegisterDevice = () => {
    return useMutation({
        mutationFn: async () => {
            if (!Device.isDevice) return;

            const pushTokenResponse = await Notifications.getExpoPushTokenAsync({
                projectId: "fdd82ade-643f-4899-8a37-1e9821d4900c",
            });

            const deviceToken = (await Notifications.getDevicePushTokenAsync())?.data;
            const pushToken = pushTokenResponse.data;
            const expoDeviceID = `${Device.deviceName}-${Device.modelName}`;

            await registerUserDevice({
                push_token: pushToken,
                device_token: deviceToken,
                expo_device_id: expoDeviceID,
                platform: Platform.OS,
            });
        },
    });
};

export default useRegisterDevice;