import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {useSearchStoreSelectors} from "@/features/search/store/search";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import Block from "@/common/components/block/Block";
import UserContextProvider from "@/features/user/context/UserContextProvider";
import UserTile from "@/features/user/components/user-tile/UserTile";
import User from "@/features/user/classes/User";
import useSearchUsers from "@/features/search/hooks/useSearchUsers";

interface SearchTrackResultsProps {

}

const SearchUsersResults = ({}: SearchTrackResultsProps) => {

    const query = useSearchStoreSelectors.query()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const searchUsersQuery = useSearchUsers(query)

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<User>) => (
        <UserContextProvider user={item}>
            <UserTile />
        </UserContextProvider>
    ), [])

    const routeAdditionalUsers = useCallback(() => {
        // TODO
    }, [])

    return(
        <View style={styles.wrapper}>
            <Block
                <User>
                title={"Users"}
                subtitle={"View all"}
                callback={routeAdditionalUsers}
                query={searchUsersQuery}
                renderItem={RenderItem}
            />
        </View>
    )
}

export default SearchUsersResults