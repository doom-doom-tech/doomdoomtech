import {createContext, useContext} from "react";
import {WithChildren} from "@/common/types/common";

interface ListContextProviderProps extends WithChildren {
    uuid: string
}

const ListContext = createContext<string>('')

const ListContextProvider = ({children, uuid}: ListContextProviderProps) => {
    return(
        <ListContext.Provider value={uuid}>
            {children}
        </ListContext.Provider>
    )
}

export const useListContext = () => useContext(ListContext)

export default ListContextProvider