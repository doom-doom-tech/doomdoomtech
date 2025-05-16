import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import useUserFollowing from "@/features/follow/hooks/useUserFollowing";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import User from "@/features/user/classes/User";
import UserRow from "@/features/user/components/user-row/UserRow";
import UserContextProvider from "@/features/user/context/UserContextProvider";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";
import _ from "lodash";
import Input from "@/common/components/inputs/Input";
import {spacing} from "@/theme";
import useUsers from "@/features/user/hooks/useUsers";
import useSearchUsers from "@/features/search/hooks/useSearchUsers";

const UploadArtistsList = () => {

    const {height} = useWindowDimensions()

    const [query, setQuery] = useState<string>('')

    const currentUser = useGlobalUserContext()

    const usersQuery = useSearchUsers(query)

    const artists = useUploadStoreSelectors.artists()
    const {setState: setUploadState} = useUploadStoreSelectors.actions()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                height: height * 0.6,
                gap: spacing.m
            },
            container: {
                paddingBottom: 400
            }
        })
    }, []);

    const handleSelectArtist = useCallback((artist: User) => () => {
        if (artist.getID() === currentUser?.getID()) return

        setUploadState({
            artists: _.some(artists, uploadableArtist => uploadableArtist.artist.getID() === artist.getID())
                ? _.reject(artists, uploadableArtist => uploadableArtist.artist.getID() === artist.getID())
                : [...artists, {artist, role: 'Artist', royalties: 0}]
        })
    }, [artists, currentUser])

    const selected = useCallback((artist: User) => {
        return _.some(artists, a => a.artist.getID() === artist.getID())
    }, [artists])

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<User>) => (
        <UserContextProvider user={item} key={index}>
            <UserRow
                selectable
                type={'no-action'}
                selected={selected(item)}
                callback={handleSelectArtist(item)}
            />
        </UserContextProvider>
    ), [selected, artists, handleSelectArtist])

    const ListHeaderComponent = useMemo(() => (
        <UserContextProvider user={currentUser!}>
            <UserRow
                selectable
                type={'no-action'}
                selected={true}
                callback={_.noop}
            />
        </UserContextProvider>
    ), [currentUser])

    return (
        <View style={styles.wrapper}>
            <Input
                wrapperStyle={{paddingHorizontal: spacing.m}}
                placeholder={"Search for artists"} onChangeText={setQuery}/>
            <List
                <User>
                infinite
                contentContainerStyle={styles.container}
                ListHeaderComponent={query ? <></> : ListHeaderComponent}
                renderItem={RenderItem}
                query={usersQuery}
            />
        </View>
    )
}


export default UploadArtistsList