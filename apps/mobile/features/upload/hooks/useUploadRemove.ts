import api from "@/common/services/api"
import {useMutation, useQueryClient} from "@tanstack/react-query"

export interface DeleteUploadRequest {
    trackID: number
}

const removeUpload = async (data: DeleteUploadRequest) => {
    await api.post('/upload/remove', data)
}

const useUploadRemove = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: DeleteUploadRequest) => removeUpload(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['uploads', 'pending'] })
        }
    })
}

export default useUploadRemove