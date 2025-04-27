import {useMutation} from "@tanstack/react-query";
import {TrackIDRequest} from "@/features/track/types/request";
import api from "@/common/services/api";

interface BatchTrackPlaytimeRequest extends TrackIDRequest {
    amount: number
}

const batchTrackPlaytime = async (data: BatchTrackPlaytimeRequest) => {
    try {
        const response = await api.post(`/track/${data.trackID}/playtime`, data);
        return response.data;
    } catch (error: any) {
        if (error.response?.status !== 401) throw error;
    }
};

const useTrackPlaytimeBatch = () => useMutation({
    mutationFn: (data: BatchTrackPlaytimeRequest) => batchTrackPlaytime(data)
})

export default useTrackPlaytimeBatch