import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import useUserLatest from "@/features/user/hooks/useUserLatest";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import Block from "@/common/components/block/Block";
import UserContextProvider from "@/features/user/context/UserContextProvider";
import User from "@/features/user/classes/User";
import UserTile from "@/features/user/components/user-tile/UserTile";
import useEventListener from "@/common/hooks/useEventListener";
import {router} from "expo-router";

interface NewArtistsProps {

}

const NewArtists = ({}: NewArtistsProps) => {

    const period = useFilterStoreSelectors.period()
    const subgenre = useFilterStoreSelectors.subgenre()
    const genre = useFilterStoreSelectors.genre()
    const tag = useFilterStoreSelectors.label()

    const newArtistsQuery = useUserLatest({
        period: period.value, genreID: genre?.getID(), subgenreID: subgenre?.getID(), labelTag: tag
    })

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<User>) => (
        <UserContextProvider user={item} key={item.getID()}>
            <UserTile />
        </UserContextProvider>
    ), [])

    const routeAdditionalUsers = useCallback(() => {
        router.push('/list/latestArtists');
    }, [])

    useEventListener('charts:refetch', newArtistsQuery.refetch)

    return(
        <View style={styles.wrapper}>
            <Block
                <User>
                title={"New artists"}
                subtitle={"View all"}
                callback={routeAdditionalUsers}
                query={newArtistsQuery}
                renderItem={RenderItem}
            />
        </View>
    )
}

export default NewArtists