import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {router, useLocalSearchParams} from "expo-router";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import User from "@/features/user/classes/User";
import UserRow from "@/features/user/components/user-row/UserRow";
import UserContextProvider from "@/features/user/context/UserContextProvider";
import Header from "@/common/components/header/Header";
import {wait} from "@/common/services/utilities";
import useUserFollowing from "@/features/follow/hooks/useUserFollowing";

interface FollowersProps {

}

const Followers = ({}: FollowersProps) => {

    const { id } = useLocalSearchParams()

    const userFollowingQuery = useUserFollowing({ userID: Number(id) })

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            container: {
                paddingBottom: 200
            }
        })
    }, []);

    const handleRouteUser = useCallback((item: User) => async () => {
        router.back()
        await wait(200)
        router.push(`/user/${item.getID()}`)
    }, [])

    const renderItem = useCallback(({item, index}: ListRenderItemPropsInterface<User>) => (
        <UserContextProvider user={item}>
            <UserRow
                type={'no-action'}
                callback={handleRouteUser(item)}
            />
        </UserContextProvider>
    ), [])

    return(
        <View style={styles.wrapper}>
            <Header title={"Following"} />
            <List
                <User>
                infinite
                disableVirtualization
                contentContainerStyle={styles.container}
                query={userFollowingQuery}
                renderItem={renderItem}
            />
        </View>
    )
}

export default Followers