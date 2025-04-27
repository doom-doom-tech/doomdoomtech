import {useMutation} from "@tanstack/react-query";
import api from "@/common/services/api";
import {DeviceEventEmitter} from "react-native";

const validateSubscription = async () => {
    await api.get('/subscription/validate')
}

const useSubscriptionValidate = () => useMutation({
    mutationFn: () => validateSubscription(),
    onSuccess: () => DeviceEventEmitter.emit('user:invalidate')
})

export default useSubscriptionValidate;