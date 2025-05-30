import api from "@/common/services/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import _ from "lodash";
import {TrackInterface} from "@/features/track/types";
import {CreateTrackRequest} from "@/features/track/types/request";

const createTrack = async (data: CreateTrackRequest): Promise<TrackInterface> => {
    const response = await api.post('/track', data)
    return _.get(response, 'data.data.track')
}

const useTrackCreate = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createTrack,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['uploads', 'pending'] })
        }
    })
}

export default useTrackCreate