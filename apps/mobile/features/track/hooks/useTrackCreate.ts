import api from "@/common/services/api";
import {useMutation} from "@tanstack/react-query";
import _ from "lodash";
import {TrackInterface} from "@/features/track/types";
import {CreateTrackRequest} from "@/features/track/types/request";

const createTrack = async (data: CreateTrackRequest): Promise<TrackInterface> => {
    const response = await api.post('/track', data)
    return _.get(response, 'data.data.track')
}

const useTrackCreate = () => useMutation({
    mutationFn: createTrack
})

export default useTrackCreate