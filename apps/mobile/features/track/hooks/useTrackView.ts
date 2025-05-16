import {useMutation} from "@tanstack/react-query";
import {TrackIDRequest} from "@/features/track/types/request";
import api from "@/common/services/api";

const createView = async (data: TrackIDRequest) => {
    api.post(`/track/${data.trackID}/view`);
};

const useTrackCreateView = () => useMutation({
    mutationFn: (data: TrackIDRequest) => createView(data)
})

export default useTrackCreateView