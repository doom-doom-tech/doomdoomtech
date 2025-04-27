import api, {STORAGE_KEYS} from "@/common/services/api";
import SingleUser from "@/features/user/classes/SingleUser";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useConnectUserDevice} from "@/features/device/hooks/useConnectUserDevice";

const verifyCode = async (data: { code: string, email: string }): Promise<{ user: SingleUser, token: string}> => {
    const response = await api.post('/auth/authorize', data)
    return {
        user: new SingleUser(response.data.data.user),
        token: response.data.data.token
    }
}

const useAuthVerifyCode = () => {

    const queryClient = useQueryClient()
    const connectDevice = useConnectUserDevice()

    return useMutation({
        mutationFn: verifyCode,
        onSuccess: async (response) => {
            try {
                await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
                await AsyncStorage.setItem('Auth.accessToken', response.token);
                await queryClient.refetchQueries({ queryKey: ['conversations'] });
                await connectDevice(response.user.getID());
            } catch (error) {
                console.error("onSuccess error:", error);
                throw error;
            }
        }
    })
}

export default useAuthVerifyCode