import {useMutation} from "@tanstack/react-query";
import api, {STORAGE_KEYS} from "@/common/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device"

const requestFreshSession = async () => {
    // Set device ID header required for session creation
    api.defaults.headers['x-device-id'] = Device.modelId
    return await api.post('/session/create')
}

const useSessionRequest = () => useMutation({
    mutationFn: () => requestFreshSession(),
    onSuccess: async (response) => {
        await AsyncStorage.setItem(STORAGE_KEYS.SESSION, response.headers['x-session-id']);
    }
})

export default useSessionRequest