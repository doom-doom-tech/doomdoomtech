import {WithChildren} from "@/common/types/common";
import {createContext, CSSProperties} from "react";
import User from "@/features/user/classes/User";
import SingleUser from "@/features/user/classes/SingleUser";

interface UserContextProviderProps extends WithChildren {
    user: User | SingleUser
}

export const UserContext = createContext<User | SingleUser | undefined>(undefined)

const UserContextProvider = ({user, children}: UserContextProviderProps) => {

    const styles: Record<string, CSSProperties> = {}

    return(
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider