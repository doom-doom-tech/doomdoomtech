import {createContext, useContext} from "react";
import {WithChildren} from "@/common/types/common";

interface VisiblityContextProviderProps extends WithChildren {
    value: boolean
}

const VisibilityContext = createContext<boolean>(false)

const VisiblityContextProvider = ({value, children}: VisiblityContextProviderProps) => {
    return(
        <VisibilityContext.Provider value={value}>
            {children}
        </VisibilityContext.Provider>
    )
}

export const useVisiblityContext = () => useContext(VisibilityContext)

export default VisiblityContextProvider