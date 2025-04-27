import {useMutation, useQueryClient} from "@tanstack/react-query";
import {TrackIDRequest} from "@/features/track/types/request";
import api from "@/common/services/api";

const acceptCollab = async (data: TrackIDRequest) => {
	await api.post('/collab/decline', data)
}

const useCollabDecline = () => {

	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: TrackIDRequest) => acceptCollab(data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['alerts'] })
		}
	})
}

export default useCollabDecline