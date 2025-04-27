import {StyleSheet} from 'react-native'
import {useCallback, useMemo} from "react";
import Screen from "@/common/components/Screen";
import Header from "@/common/components/header/Header";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import User from "@/features/user/classes/User";
import UserContextProvider from "@/features/user/context/UserContextProvider";
import BlockedUserRow from "@/features/settings/components/BlockedUserRow";
import useBlockedUsers from "@/features/user/hooks/useBlockedUsers";

interface BlockedUsersProps {

}

const BlockedUsers = ({}: BlockedUsersProps) => {

    const blockedUsersQuery = useBlockedUsers()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<User>) => (
        <UserContextProvider user={item} key={index}>
            <BlockedUserRow />
        </UserContextProvider>
    ), [])


    return(
        <Screen>
            <Header title={"Blocked users"} />
            <List renderItem={RenderItem} query={blockedUsersQuery} />
        </Screen>
    )
}

export default BlockedUsers