import {StyleSheet} from 'react-native'
import {createContext, useContext, useMemo} from "react";
import {BottomTabBarProps} from "@react-navigation/bottom-tabs/src/types";
import {WithChildren} from "@/common/types/common";

interface TabBarContextProviderProps extends WithChildren{
    value: BottomTabBarProps
}

const TabBarContext = createContext<BottomTabBarProps>({} as BottomTabBarProps)

const TabBarContextProvider = ({value, children}: TabBarContextProviderProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    return(
        <TabBarContext.Provider value={value}>
            {children}
        </TabBarContext.Provider>
    )
}

export const useTabContext = () => {
    return useContext(TabBarContext)
}

export default TabBarContextProvider