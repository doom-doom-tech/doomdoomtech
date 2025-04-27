import {useMutation, useQueryClient} from "@tanstack/react-query";

import {DeviceEventEmitter} from "react-native";
import {BlockUserRequest} from "@/features/user/types/requests";
import api from "@/common/services/api";

const blockUser = async (data: BlockUserRequest) => {
	await api.post('/user/block', data)
}

const useUserBlock = () => {

	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: BlockUserRequest) => blockUser(data),
		onSuccess: () => {

			DeviceEventEmitter.emit('feed:refetch')

			queryClient.invalidateQueries({ queryKey: ['blocked'] })
			queryClient.invalidateQueries({ queryKey: ['followers'] })
			queryClient.invalidateQueries({ queryKey: ['followees'] })
			queryClient.invalidateQueries({ queryKey: ['tracks'] })
			queryClient.invalidateQueries({ queryKey: ['users'] })
			queryClient.invalidateQueries({ queryKey: ['feed'] })
		}
	})
}

export default useUserBlock