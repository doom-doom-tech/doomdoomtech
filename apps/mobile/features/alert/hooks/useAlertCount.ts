import {useQuery} from "@tanstack/react-query";
import api from "@/common/services/api";
import _ from "lodash";

const fetchAlertsCount = async () => {
    const response = await api.get(`/alert/count`);
    return _.get(response, 'data.data.count')
}

const useAlertCount = () => useQuery({
    queryFn: () => fetchAlertsCount(),
    queryKey: ['alerts', 'count']
})

export default useAlertCount;