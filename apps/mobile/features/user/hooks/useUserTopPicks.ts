import {useQuery} from "@tanstack/react-query";
import _ from "lodash";
import api from "@/common/services/api";
import Track from "@/features/track/classes/Track";
import {UserIDRequest} from "@/features/user/types/requests";

const fetchUserTopPicks = async (data: UserIDRequest): Promise<Array<Track>> => {
    const response = await api.get(`/user/${data.userID}/top-picks`)
    return _.map(_.get(response, 'data.data.tracks'), track => new Track(track))
}

const useUserTopPicks = (data: UserIDRequest) => useQuery({
    queryKey: ['users', data.userID, 'top-picks'],
    queryFn: () => fetchUserTopPicks(data),
})

export default useUserTopPicks