import {StyleSheet} from 'react-native'
import {createContext, useContext, useMemo} from "react";
import Alert from "@/features/alert/classes/Alert";
import {WithChildren} from "@/common/types/common";

interface AlertContextProviderProps extends WithChildren {
    alert: Alert
}

const AlertContext = createContext<Alert>({} as Alert)

const AlertContextProvider = ({alert, children}: AlertContextProviderProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    return(
        <AlertContext.Provider value={alert}>
            {children}
        </AlertContext.Provider>
    )
}

export const useAlertContext = () => {
    return useContext(AlertContext)
}

export default AlertContextProvider