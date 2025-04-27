import {useContext} from "react";
import SingleUser from "@/features/user/classes/SingleUser";
import {GlobalUserContext} from "@/features/user/context/GlobalUserContextProvider";

const useGlobalUserContext = () => {
	return useContext<SingleUser | null>(GlobalUserContext)
}

export default useGlobalUserContext