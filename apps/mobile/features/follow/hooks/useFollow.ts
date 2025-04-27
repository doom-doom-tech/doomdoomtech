import {useMutation} from "@tanstack/react-query";
import {UserIDRequest} from "@/features/user/types/requests";
import api from "@/common/services/api";

const followUser = async (data: UserIDRequest) => {
    await api.post('/follow', data)
}

const useFollow = () => useMutation({
    mutationFn: (data: UserIDRequest) => followUser(data)
})

export default useFollow