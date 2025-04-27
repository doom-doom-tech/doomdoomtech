import {useQuery} from "@tanstack/react-query";
import _ from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SingleUser from "@/features/user/classes/SingleUser";
import api from "@/common/services/api";
import {useAuthStoreSelectors} from "@/features/auth/store/auth";

export const fetchCurrentUser = async (): Promise<SingleUser | null> => {
	const accessToken = await AsyncStorage.getItem('Auth.accessToken')
	if(!accessToken) return null

	const response = await api.get('/user/current')
	return new SingleUser(_.get(response, 'data.data.user'))
}

const useUserCurrent = () => {

	const authorized = useAuthStoreSelectors.authorized()

	return useQuery({
		queryKey: ['users', 'current', authorized],
		queryFn: () => fetchCurrentUser(),
		retry: false
	})
}

export default useUserCurrent