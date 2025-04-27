import {useMutation} from "@tanstack/react-query";
import api from "../services/api";

export interface ReportEntityRequest {
    entityType: "Track" | "Comment" | "Note" | "Album"
    entityID: number
    content: string
}

const report = async (data: ReportEntityRequest) => {
    await api.post('/report', data)
}

const useReport = () => useMutation({
    mutationFn: (data: ReportEntityRequest) => report(data)
})

export default useReport