import {useMutation, useQueryClient} from "@tanstack/react-query";
import api from "@/common/services/api";
import {DeleteCommentRequest} from "@/features/comment/types/requests";
import {DeviceEventEmitter} from "react-native";

const deleteComment = async (data: DeleteCommentRequest) => {
    await api.get(`/comments/${data.commentID}/delete`)
}

const useCommentDelete = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: DeleteCommentRequest) => deleteComment(data),
        onSuccess: async (res, req) => {
            await queryClient.invalidateQueries({ queryKey: ['notes'] })
            await queryClient.invalidateQueries({ queryKey: ['tracks'] })

            DeviceEventEmitter.emit('comments:refetch')
            DeviceEventEmitter.emit('replies:refetch')
            DeviceEventEmitter.emit('notes:refetch')
        }
    })
}

export default useCommentDelete