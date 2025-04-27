import {useMutation} from "@tanstack/react-query";
import {LikeTrackRequest} from "@/features/track/types/request";
import api from "@/common/services/api";
import * as StoreReview from 'expo-store-review'
import {useTimeTrackStoreTotalTime} from "@/common/store/time-tracking";

const likeTrack = async (data: LikeTrackRequest) => {
    await api.post('/track/like', data)
}

const useTrackLike = () => {

    const timeSpent = useTimeTrackStoreTotalTime()

    return useMutation({
        mutationFn: (data: LikeTrackRequest) => likeTrack(data),
        onSuccess: async () => {
            if (await StoreReview.hasAction() && timeSpent > (5 * 60 * 1000)) {
                setTimeout(async () => {
                    await StoreReview.requestReview()
                }, 1000)
            }
        }
    })
}

export default useTrackLike