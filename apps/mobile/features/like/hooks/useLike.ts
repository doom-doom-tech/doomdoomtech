import {useMutation} from "@tanstack/react-query";
import api from "@/common/services/api";
import {LikeRequest} from "@/features/like/types/requests";

const like = async (data: LikeRequest) => {
    await api.post('/like', data)
}

const useLike = () => {
    return useMutation({
        mutationFn: (data: LikeRequest) => like(data),
        onSuccess: async (data, variables, context) => {

        }
    })
}

export default useLike