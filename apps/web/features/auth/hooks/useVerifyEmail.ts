import api from "@/common/services/api";
import {VerifyEmailRequest} from "@/features/auth/types/auth";
import {useMutation} from "@tanstack/react-query";


const verifyEmail = async (data: VerifyEmailRequest) => {
    await api.post('/auth/verify-email', data)
}

const useVerifyEmail = () => {
    return useMutation({
        mutationFn: verifyEmail
    })
}

export default useVerifyEmail