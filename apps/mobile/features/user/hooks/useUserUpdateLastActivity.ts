import {useMutation} from "@tanstack/react-query";
import api from "@/common/services/api";

const updateLastActivity = async () => {
	await api.post('/user/last-active')
}

const useUserUpdateLastActivity = () => useMutation({
	mutationFn: updateLastActivity
})

export default useUserUpdateLastActivity