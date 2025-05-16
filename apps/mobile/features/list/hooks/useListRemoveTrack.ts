import {useMutation, useQueryClient} from "@tanstack/react-query";
import api from "@/common/services/api";
import {TrackIDRequest} from "@/features/track/types/request";
import {DeviceEventEmitter} from "react-native";

const saveTrack = async (data: TrackIDRequest) => {
    await api.delete('/list/track', { data })
}

const useListRemoveTrack = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: TrackIDRequest) => saveTrack(data),
        onMutate: (variables) => {
            DeviceEventEmitter.emit(`list:track:remove`, variables.trackID)
        },
        onSuccess: async (res, req) => {
            DeviceEventEmitter.emit(`top-picks:refetch`)
        }
    })
}

export default useListRemoveTrack