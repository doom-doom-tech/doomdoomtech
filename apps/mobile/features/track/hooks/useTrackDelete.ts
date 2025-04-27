import {useMutation} from "@tanstack/react-query";
import {TrackIDRequest} from "@/features/track/types/request";
import api from "@/common/services/api";

const deleteTrack = async (data: TrackIDRequest) => {
    await api.delete('/track', {
        data
    })
}

const useTrackDelete = () => useMutation({
    mutationFn: (data: TrackIDRequest) => deleteTrack(data)
})

export default useTrackDelete