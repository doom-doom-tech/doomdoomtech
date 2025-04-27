import {useMutation} from "@tanstack/react-query";
import {UserIDRequest} from "@/features/user/types/requests";
import api from "@/common/services/api";

const visitUser = async (data: UserIDRequest) => {
    await api.post(`/user/${data.userID}/visit`)
}

const useUserVisit = () => useMutation({
    mutationFn: (data: UserIDRequest) => visitUser(data)
})

export default useUserVisit