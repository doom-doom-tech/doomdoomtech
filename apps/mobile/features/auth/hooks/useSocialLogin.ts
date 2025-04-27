import {useMutation} from "@tanstack/react-query";
import {SocialLoginRequest} from "@/features/auth/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {DeviceEventEmitter} from "react-native";
import {useConnectUserDevice} from "@/features/device/hooks/useConnectUserDevice";
import {SingleUserInterface} from "@/features/user/types";
import api from "@/common/services/api";
import {useAuthStoreSelectors} from "@/features/auth/store/auth";

interface SocialLoginSuccessPayload {
	user: SingleUserInterface
	token: string
}

const handleSocialLogin = async (data: SocialLoginRequest): Promise<SocialLoginSuccessPayload> => {
	const response = await api.post(`/auth/social/${data.platform}`, data)
	return response.data
}

const useSocialLogin = () => {
	const connectDevice = useConnectUserDevice()
	const setAuthState = useAuthStoreSelectors.setState()

	return useMutation({
		mutationFn: (data: SocialLoginRequest) => handleSocialLogin(data),
		onSuccess: async (response, variables, context) => {
			await AsyncStorage.setItem('Auth.accessToken', response.token)
			DeviceEventEmitter.emit('user:invalidate')
			setAuthState({ authorized: true })
			await connectDevice(response.user.id)
		}
	})
}

export default useSocialLogin