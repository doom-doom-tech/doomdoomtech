import {useQuery} from "@tanstack/react-query";
import api from "@/common/services/api";
import _ from "lodash";
import Genre from "@/features/genre/classes/Genre";
import {SearchQueryInterface} from "@/common/types/common";

const fetchGenres = async (data: SearchQueryInterface) => {
    const response = await api.get(`/genre/all?query=${data.query}`)
    return _.map(_.get(response, 'data.data.genres'), genre => new Genre(genre))
}

const useGenres = (data: SearchQueryInterface) => useQuery({
    queryKey: ['genres'],
    queryFn: () => fetchGenres(data)
})

export default useGenres