import {useMutation} from "@tanstack/react-query";
import api from "@/common/services/api";
import {UpdateListTracksRequest} from "@/features/list/types/requests";

const updateListPositions = async (data: UpdateListTracksRequest) => {
    await api.post('/list/update', data)
}

const useListUpdatePositions = () => useMutation({
    mutationFn: (data: UpdateListTracksRequest) => updateListPositions(data)
})

export default useListUpdatePositions