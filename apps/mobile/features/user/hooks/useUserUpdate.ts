import api from "@/common/services/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {DeviceEventEmitter} from "react-native";

const updateUser = async (data: FormData) => {
    await api.put('/user', data)
}

const useUserUpdate = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: FormData) => updateUser(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['users', 'current'] })
            DeviceEventEmitter.emit('user:invalidate')
        }
    })
}

export default useUserUpdate