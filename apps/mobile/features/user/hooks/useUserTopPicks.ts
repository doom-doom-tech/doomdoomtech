import {useQuery} from "@tanstack/react-query";
import _ from "lodash";
import api from "@/common/services/api";
import Track from "@/features/track/classes/Track";
import {UserIDRequest} from "@/features/user/types/requests";

const fetchUserTopPicks = async (data: UserIDRequest & { query?: string | null, genre: number | null, subgenre: number | null }): Promise<Array<Track>> => {
    const response = await api.get(`/user/${data.userID}/top-picks`, {
        params: {
            query: data.query,
            genre: data.genre,
            subgenre: data.subgenre
        }
    })
    return _.map(_.get(response, 'data.data.tracks'), track => new Track(track))
}

const useUserTopPicks = (data: UserIDRequest & { query?: string | null, genre: number | null, subgenre: number | null }) => useQuery({
    queryKey: ['users', data.userID, 'top-picks', data.query, data.genre, data.subgenre],
    queryFn: () => fetchUserTopPicks(data),
    enabled: Boolean(data.query)
})

export default useUserTopPicks