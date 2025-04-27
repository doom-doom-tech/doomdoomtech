import {useMutation} from "@tanstack/react-query";
import {TrackIDRequest} from "@/features/track/types/request";
import api from "@/common/services/api";

const createView = async (data: TrackIDRequest) => {
    try {
        const response = await api.post(`/track/${data.trackID}/view`);
        return response.data; // Return data if successful
    } catch (error: any) {
        if(error.response?.status !== 401) throw error
    }
};

const useTrackCreateView = () => useMutation({
    mutationFn: (data: TrackIDRequest) => createView(data)
})

export default useTrackCreateView