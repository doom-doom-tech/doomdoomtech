import {WithChildren} from "@/common/types/common";
import {createContext, useContext} from "react";
import Label from "@/features/label/classes/Label";

interface LabelContextProviderProps extends WithChildren {
    label: Label
}

export const LabelContext = createContext<Label | undefined>(undefined)

const LabelContextProvider = ({label, children}: LabelContextProviderProps) => {
    return(
        <LabelContext.Provider value={label}>
            {children}
        </LabelContext.Provider>
    )
}

export const useLabelContext = () => {
    const user = useContext(LabelContext)
    if(!user) throw new Error('LabelContext: No value provided')
    return user
}

export default LabelContextProvider