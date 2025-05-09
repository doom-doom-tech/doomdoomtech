import {ActivityIndicator, DeviceEventEmitter, StyleSheet, View} from 'react-native'
import {Fragment, useCallback, useEffect, useMemo} from "react";
import Screen from "@/common/components/Screen";
import SingleUserContextProvider from "@/features/user/context/SingleUserContextProvider";
import {spacing} from "@/theme";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useLocalSearchParams} from "expo-router";
import useUser from "@/features/user/hooks/useUser";
import Error from "@/common/screens/Error";
import useUserVisit from "@/features/user/hooks/useUserVisit";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import Scroll from "@/common/components/Scroll";
import UserHeader from "@/features/user/components/user-header/UserHeader";
import UserBiography from "@/features/user/components/UserBiography";
import UserSocials from "@/features/user/components/UserSocials";
import UserActions from "@/features/user/components/user-actions/UserActions";
import UserLists from "@/features/user/components/user-lists/UserLists";

const User = () => {

    const user = useGlobalUserContext()

    const { top } = useSafeAreaInsets()

    const { id } = useLocalSearchParams();

    const visitUserMutation = useUserVisit()

    const userQuery = useUser({ userID: id ? Number(id) : 32 })

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
                marginTop: -top,
                gap: spacing.m
            },
            container: {
                gap: spacing.m,
                paddingBottom: 200
            }
        })
    }, []);

    useEffect(() => {
        if(user && user.getID() === Number(id)) return
        visitUserMutation.mutate({
            userID: Number(id)
        })
    }, [user, id]);

    const handleRefetchUser = useCallback(async () => {
        DeviceEventEmitter.emit('user:invalidate')
        await userQuery.refetch()
    }, [])

    if(userQuery.isLoading) return <ActivityIndicator />

    if (userQuery.isError) {
        // Render the 404 page if an error occurs
        return <Error title={"We can't find this user"} />
    }

    if(userQuery.isError || userQuery.data === undefined || !userQuery.data) return <Fragment />

    return(
        <Screen>
            <SingleUserContextProvider user={userQuery.data}>
                <View style={styles.wrapper}>
                    <Scroll contentContainerStyle={styles.container} onRefresh={handleRefetchUser} refreshing={userQuery.isRefetching}>
                        <UserHeader />
                        <UserBiography />
                        <UserSocials />
                        <UserActions />
                        <UserLists />
                    </Scroll>
                </View>
            </SingleUserContextProvider>
        </Screen>
    )
}

export default User