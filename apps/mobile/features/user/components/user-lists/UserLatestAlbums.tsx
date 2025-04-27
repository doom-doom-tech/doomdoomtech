import {StyleSheet, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import useSingleUserContext from "@/features/user/hooks/useSingleUserContext";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import Block from "@/common/components/block/Block";
import useUserAlbums from "@/features/user/hooks/useUserAlbums";
import AlbumTile from "@/features/album/components/album-tile/AlbumTile";
import Album from "@/features/album/classes/Album";
import {extractItemsFromInfinityQuery} from "@/common/services/utilities";

interface UserLatestAlbumsProps {

}

const UserLatestAlbums = ({}: UserLatestAlbumsProps) => {

    const user = useSingleUserContext()

    const userAlbumsQuery = useUserAlbums({ userID: user.getID() })

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const routeAdditionalTracks = useCallback(() => {

    }, [])

    const RenderItem = useCallback(({item}: ListRenderItemPropsInterface<Album>) => (
        <AlbumTile album={item} key={item.getID()} />
    ), [])

    if(!extractItemsFromInfinityQuery(userAlbumsQuery.data).length) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <Block
                <Album>
                infinite
                query={userAlbumsQuery}
                title={"Latest albums"}
                subtitle={"View all"}
                callback={routeAdditionalTracks}
                renderItem={RenderItem}
            />
        </View>
    )
}

export default UserLatestAlbums