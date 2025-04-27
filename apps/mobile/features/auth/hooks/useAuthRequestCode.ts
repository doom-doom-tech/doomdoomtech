import {useMutation} from "@tanstack/react-query";
import {LoginRequest} from "@/features/auth/types/auth";
import api from "@/common/services/api";

const requestCode = async (data: LoginRequest) => {
	const response = await api.post('/auth/request', data)
	return response.data.data
}

const useAuthRequestCode = () => {
	return useMutation({
		mutationFn: (data: LoginRequest) => requestCode(data)
	})
}

export default useAuthRequestCode