import {useMutation} from "@tanstack/react-query";
import {TrackIDRequest} from "@/features/track/types/request";
import api from "@/common/services/api";

const createPlay = async (data: TrackIDRequest) => {
    try {
        const response = await api.post(`/track/${data.trackID}/play`);
        return response.data; // Return data if successful
    } catch (error: any) {
        if(error.response?.status !== 401) throw error
    }
};

const useTrackCreatePlay = () => useMutation({
    mutationFn: (data: TrackIDRequest) => createPlay(data)
})

export default useTrackCreatePlay