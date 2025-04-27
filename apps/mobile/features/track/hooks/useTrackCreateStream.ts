import {useMutation} from "@tanstack/react-query";
import {TrackIDRequest} from "@/features/track/types/request";
import api from "@/common/services/api";

const createStream = async (data: TrackIDRequest) => {
    await api.post(`/track/${data.trackID}/stream`)
}

const useTrackCreateStream = () => useMutation({
    mutationFn: (data: TrackIDRequest) => createStream(data)
})

export default useTrackCreateStream