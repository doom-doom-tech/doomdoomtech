import {useMutation} from "@tanstack/react-query";
import api from "@/common/services/api";
import {TrackIDRequest} from "@/features/track/types/request";
import {DeviceEventEmitter} from "react-native";

const saveTrack = async (data: TrackIDRequest) => {
    await api.post('/list', data)
}

const useListSaveTrack = () => useMutation({
    mutationFn: (data: TrackIDRequest) => saveTrack(data),
    onMutate: (variables) => {
        DeviceEventEmitter.emit(`list:track:save`, variables.trackID)
    },
    onSuccess: async (res, req) => {
        DeviceEventEmitter.emit(`top-picks:refetch`)
    }
})

export default useListSaveTrack