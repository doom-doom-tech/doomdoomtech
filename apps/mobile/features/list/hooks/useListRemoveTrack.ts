import {useMutation, useQueryClient} from "@tanstack/react-query";
import api from "@/common/services/api";
import {TrackIDRequest} from "@/features/track/types/request";

const saveTrack = async (data: TrackIDRequest) => {
    await api.delete('/list/track', { data })
}

const useListRemoveTrack = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: TrackIDRequest) => saveTrack(data),
    })
}

export default useListRemoveTrack