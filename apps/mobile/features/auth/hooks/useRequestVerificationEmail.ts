import {useMutation} from "@tanstack/react-query";
import api from "@/common/services/api";
import {LoginRequest} from "@/features/auth/types/auth";

const requestVerificationEmail = async (data: LoginRequest) => {
	await api.post('/auth/verify-email/request', { email: data.email })
}

const useRequestVerificationEmail = () => useMutation({
	mutationFn: (data: LoginRequest) => requestVerificationEmail(data)
})

export default useRequestVerificationEmail