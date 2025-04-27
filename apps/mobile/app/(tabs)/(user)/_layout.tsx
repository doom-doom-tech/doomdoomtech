import {Stack} from "expo-router";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";

const UserLayout = () => {

    const user = useGlobalUserContext()

    return  (
        <Stack screenOptions={{ headerShown: false }} initialRouteName={'user/[id]/index'} initialParams={{ id: user?.getID() }}  />
    )
}

export default UserLayout