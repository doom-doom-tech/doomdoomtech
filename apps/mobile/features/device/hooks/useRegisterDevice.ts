import {useMutation} from "@tanstack/react-query";
import {RegisterDeviceRequest} from "@/features/device/types/requests";
import api from "@/common/services/api";

const registerUserDevice = async (data: RegisterDeviceRequest) => {
    await api.post('/device/register', data)
}

const useRegisterDevice = () => useMutation({
    mutationFn: (data: RegisterDeviceRequest) => registerUserDevice(data)
})

export default useRegisterDevice