import {useMutation} from "@tanstack/react-query";
import api from "@/common/services/api";
import * as Device from "expo-device";

const useAuthSignout = () => {
    return useMutation({
        mutationFn: async () => {
            const expoDeviceID = `${Device.deviceName}-${Device.modelName}`;
            await api.post('/auth/sign-out', { expo_device_id: expoDeviceID });
        }
    });
};

export default useAuthSignout