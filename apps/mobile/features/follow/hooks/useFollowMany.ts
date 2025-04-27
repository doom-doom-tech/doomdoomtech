import {useMutation} from "@tanstack/react-query";
import api from "@/common/services/api";

const followUser = async (data: { users: Array<number> }) => {
    await api.post('/follow/many', data)
}

const useFollowMany = () => useMutation({
    mutationFn: (data: { users: Array<number> }) => followUser(data)
})


export default useFollowMany