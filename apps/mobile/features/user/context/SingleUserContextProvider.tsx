import {createContext} from "react";
import {WithChildren} from "@/common/types/common";
import SingleUser from "@/features/user/classes/SingleUser";

interface SingleUserContextProviderProps extends WithChildren {
	user: SingleUser
}

export const SingleUserContext = createContext<SingleUser | null>(null)

const SingleUserContextProvider = ({user, children}: SingleUserContextProviderProps) => {

	return(
        <SingleUserContext.Provider value={user}>
	        {children}
        </SingleUserContext.Provider>
    )
}

export default SingleUserContextProvider