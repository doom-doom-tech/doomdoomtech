import api from "@/common/services/api"
import { CreateTrackRequest } from "@/features/track/types/request"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const createUpload = async (data: CreateTrackRequest) => {
    await api.post('/upload/create', data)
}

const useUploadCreate = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateTrackRequest) => createUpload(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['uploads', 'pending'] })
        }
    })
}

export default useUploadCreate