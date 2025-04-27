import {useQuery} from "@tanstack/react-query";
import {TrackIDRequest} from "@/features/track/types/request";
import api from "@/common/services/api";
import Track from "@/features/track/classes/Track";
import _ from "lodash";

const fetchTrack = async (data: TrackIDRequest): Promise<Track> => {
    const response = await api.get(`/track/${data.trackID}`)
    return new Track(_.get(response, 'data.data.track'))
}

const useTrack = (data: TrackIDRequest) => useQuery({
    queryFn: () => fetchTrack(data),
    queryKey: ['tracks', data.trackID],

})

export default useTrack