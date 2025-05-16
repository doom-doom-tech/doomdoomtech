import {Slot} from "expo-router";
import GlobalUserContextProvider from "@/features/user/context/GlobalUserContextProvider";
import {RootSiblingParent} from "react-native-root-siblings";
import TrackOptions from "@/features/track/sheets/TrackOptions";

const SheetLayout = () => {
    return(
        <GlobalUserContextProvider>
            <RootSiblingParent>
                <Slot />
                <TrackOptions />
            </RootSiblingParent>
        </GlobalUserContextProvider>
    )
}

export default SheetLayout