import {useMutation} from "@tanstack/react-query";
import {TrackIDRequest} from "@/features/track/types/request";
import api from "@/common/services/api";

const createPlay = async (data: TrackIDRequest) => {
    const response = await api.post(`/track/${data.trackID}/play`);
    return response.data;
};

const useTrackCreatePlay = () => useMutation({
    mutationFn: (data: TrackIDRequest) => createPlay(data)
})

export default useTrackCreatePlay