import {useQuery} from "@tanstack/react-query";
import {SearchQueryInterface} from "@/common/types/common";
import api from "@/common/services/api";
import _ from "lodash";
import Subgenre from "@/features/genre/classes/Subgenre";

const searchSubgenres = async (data: SearchQueryInterface) => {
    const response = await api.get(`/genre/subgenre/search?query=${data.query}`)
    return _.map(_.get(response, 'data.data.genres'), subgenre => new Subgenre(subgenre))
}

const useSubgenres = (data: SearchQueryInterface) => useQuery({
    queryKey: ['subgenres', data.query],
    queryFn: () => searchSubgenres(data)
})

export default useSubgenres