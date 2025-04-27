import {useContext} from "react";
import {SingleUserContext} from "@/features/user/context/SingleUserContextProvider";

const useSingleUserContext = () => {
	const user = useContext(SingleUserContext)
	if(!user) throw new Error('SingleUserContext: No value provided')
	return user
}

export default useSingleUserContext