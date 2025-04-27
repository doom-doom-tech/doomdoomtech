import {useMutation, useQueryClient} from "@tanstack/react-query";
import {RegistrationRequest} from "@/features/auth/types/auth";
import api from "@/common/services/api";

const register = async (data: RegistrationRequest) => {
	const response = await api.post('/auth/signup', data)
	return response.data.data
}

const useAuthRegister = () => {

	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: RegistrationRequest) => register(data),
	})
}

export default useAuthRegister