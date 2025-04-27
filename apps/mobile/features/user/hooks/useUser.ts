import {useQuery} from "@tanstack/react-query";

import _ from "lodash";
import api from "@/common/services/api";
import SingleUser from "@/features/user/classes/SingleUser";
import {SingleUserInterface} from "@/features/user/types";
import {UserIDRequest} from "@/features/user/types/requests";
import {fetchCurrentUser} from "@/features/user/hooks/useUserCurrent";

const fetchSingleUser = async (data: UserIDRequest) => {
	const response = await api.get('/user/' + data.userID)
	return new SingleUser(_.get(response, 'data.data.user') as SingleUserInterface)
}

const useUser = (data: UserIDRequest) => useQuery({
	queryKey: ['users', data.userID],
	queryFn: () => data.userID ? fetchSingleUser(data) : fetchCurrentUser()
})

export default useUser