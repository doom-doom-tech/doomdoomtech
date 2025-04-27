import {Slot} from "expo-router";
import GlobalUserContextProvider from "@/features/user/context/GlobalUserContextProvider";
import {RootSiblingParent} from "react-native-root-siblings";

const SheetLayout = () => {
    return(
        <GlobalUserContextProvider>
            <RootSiblingParent>
                <Slot />
            </RootSiblingParent>
        </GlobalUserContextProvider>
    )
}

export default SheetLayout