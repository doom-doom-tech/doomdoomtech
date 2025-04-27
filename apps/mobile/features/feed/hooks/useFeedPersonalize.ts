import {useMutation} from "@tanstack/react-query";
import api from "@/common/services/api";

const personalizeFeed = async (data: { genres: Array<number> }) => {
    await api.post('/personalize', data)
}

const useFeedPersonalize = () => useMutation({
    mutationFn: (data: { genres: Array<number> }) =>  personalizeFeed(data)
})

export default useFeedPersonalize