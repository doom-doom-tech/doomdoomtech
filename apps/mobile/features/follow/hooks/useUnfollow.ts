import {UserIDRequest} from "@/features/user/types/requests";
import api from "@/common/services/api";
import {useMutation} from "@tanstack/react-query";

const unfollowUser = async (data: UserIDRequest) => {
    await api.post('/follow/remove', data)
}

const useUnfollow = () => useMutation({
    mutationFn: (data: UserIDRequest) => unfollowUser(data)
})

export default useUnfollow