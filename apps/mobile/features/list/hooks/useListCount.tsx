import api from "@/common/services/api";
import _ from "lodash";
import {useQuery} from "@tanstack/react-query";

const fetchCount = async () => {
    const response = await api.get(`/list/count`);
    return _.get(response, 'data.data.count')
}

const useListCount = () => useQuery({
    queryFn: () => fetchCount(),
    queryKey: ['list', 'count']
})

export default useListCount;