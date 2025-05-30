import {useQuery} from "@tanstack/react-query"
import api from "@/common/services/api"
import _ from "lodash"

const fetchPendingUploads = async () => {
    const response = await api.get('/upload/latest')
    return _.get(response, 'data.data.upload')
}

const useUploadsPending = (enabled: boolean) => useQuery({
    queryKey: ['uploads', 'pending', 2],
    queryFn: fetchPendingUploads,
    enabled,
    staleTime: 0,            // mark data stale immediately
    refetchOnMount: true,    // always refetch on mount
    refetchOnWindowFocus: false // disable auto refetch on focus (optional)
});

export default useUploadsPending