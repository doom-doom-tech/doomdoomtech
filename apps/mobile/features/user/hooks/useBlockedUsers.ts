import {useQuery} from "@tanstack/react-query";
import _ from "lodash";
import api from "@/common/services/api";
import User from "@/features/user/classes/User";

const fetchBlockedUsers = async () => {
	const response = await api.get('/user/block')
	return _.map(_.get(response, 'data.data.users'), user => new User(user))
}

const useBlockedUsers = () => useQuery({
	queryFn: fetchBlockedUsers,
	queryKey: ['users', 'blocked']
})

export default useBlockedUsers