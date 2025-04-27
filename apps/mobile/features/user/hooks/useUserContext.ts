import {useContext} from "react";
import {UserContext} from "@/features/user/context/UserContextProvider";

const useUserContext = () => {
	const user = useContext(UserContext)
	if(!user) throw new Error('UserContext: No value provided')
	return user
}

export default useUserContext