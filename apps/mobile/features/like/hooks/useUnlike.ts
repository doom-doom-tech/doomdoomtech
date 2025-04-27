import {useMutation} from "@tanstack/react-query";
import api from "@/common/services/api";
import {LikeRequest} from "@/features/like/types/requests";

const unlike = async (data: LikeRequest) => {
    await api.delete('/like', { data })
}

const useUnlike = () => useMutation({
    mutationFn: (data: LikeRequest) => unlike(data)
})

export default useUnlike