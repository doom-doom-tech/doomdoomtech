import {useMutation} from "@tanstack/react-query";
import api from "@/common/services/api";
import {PostCommentRequest} from "@/features/comment/types/requests";
import {DeviceEventEmitter} from "react-native";

const postComment = async (data: PostCommentRequest) => {
    await api.post('/comments', data)
}

const useCommentPost = () => useMutation({
    mutationFn: (data: PostCommentRequest) => postComment(data),
    onSuccess: async (res, req) => {
        DeviceEventEmitter.emit('comments:refetch')
        DeviceEventEmitter.emit('replies:refetch')
        DeviceEventEmitter.emit('notes:refetch')
    }
})

export default useCommentPost