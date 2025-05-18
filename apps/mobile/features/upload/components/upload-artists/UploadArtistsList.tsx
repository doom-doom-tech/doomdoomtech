import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import useGlobalUserContext from '@/features/user/hooks/useGlobalUserContext';
import List, { ListRenderItemPropsInterface } from '@/common/components/List';
import User from '@/features/user/classes/User';
import UserRow from '@/features/user/components/user-row/UserRow';
import UserContextProvider from '@/features/user/context/UserContextProvider';
import { useUploadStoreSelectors } from '@/features/upload/store/upload';
import _ from 'lodash';
import Input from '@/common/components/inputs/Input';
import { palette, spacing } from '@/theme';
import useSearchUsers from '@/features/search/hooks/useSearchUsers';
import { extractItemsFromInfinityQuery } from '@/common/services/utilities';

const UploadArtistsList = () => {

    const { height } = useWindowDimensions();

    const [query, setQuery] = useState<string>('');

    const currentUser = useGlobalUserContext();
    const usersQuery = useSearchUsers(query);

    const artists = useUploadStoreSelectors.artists();
    const { setState: setUploadState } = useUploadStoreSelectors.actions();

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                height: height * 0.6,
                gap: spacing.m,
            },
            container: {
                paddingBottom: 400,
            },
            selectedListContainer: {
                gap: spacing.m
            },
            searchListContainer: {
                gap: spacing.m,
            },
        });
    }, [height]);

    const handleSelectArtist = useCallback(
        (artist: User) => () => {
            if (artist.getID() === currentUser?.getID()) return;

            setUploadState({
                artists: _.some(artists, uploadableArtist => uploadableArtist.artist.getID() === artist.getID())
                    ? _.reject(artists, uploadableArtist => uploadableArtist.artist.getID() === artist.getID())
                    : [...artists, { artist, role: 'Artist', royalties: 0 }],
            });
        },
        [artists, currentUser, setUploadState]
    );

    const selected = useCallback(
        (artist: User) => {
            return _.some(artists, a => a.artist.getID() === artist.getID());
        },
        [artists]
    );

    const RenderItem = useCallback(
        ({ item, index }: ListRenderItemPropsInterface<User>) => (
            <UserContextProvider user={item} key={index}>
                <UserRow
                    selectable
                    type={'no-action'}
                    selected={selected(item)}
                    callback={handleSelectArtist(item)}
                />
            </UserContextProvider>
        ),
        [selected, handleSelectArtist]
    );

    // First list: Selected artists (from artists array)
    const selectedArtists = useMemo(() => {
        if(currentUser?.isLabel()) return artists.filter(artist => !artist.artist.isLabel()).map(artist => artist.artist);
        return artists.map(uploadableArtist => uploadableArtist.artist);
    }, [currentUser,artists]);

    // Second list: Search results excluding current user and selected artists
    const filteredQuery = useMemo(() => {
        if (usersQuery.isLoading || usersQuery.isError || usersQuery.data === undefined) return [];

        return extractItemsFromInfinityQuery<User>(usersQuery.data)
            .filter(user => user.getID() !== currentUser?.getID()) // Exclude the current user
            .filter(user => !artists.some(artist => artist.artist.getID() === user.getID())); // Exclude selected artists
    }, [artists, usersQuery, currentUser]);

    return (
        <View style={styles.wrapper}>
            <Input
                wrapperStyle={{ paddingHorizontal: spacing.m, paddingTop: spacing.m }}
                placeholder={'Search for artists'}
                onChangeText={setQuery}
            />
            {/* First List: Selected Artists */}
            <List<User>
                infinite
                style={{ height: selectedArtists.length * 100, maxHeight: 200, borderBottomWidth: 1, borderColor: palette.granite }}
                contentContainerStyle={styles.selectedListContainer}
                renderItem={RenderItem}
                data={selectedArtists}
            />
            {/* Second List: Search Results */}
            <List<User>
                infinite
                contentContainerStyle={[styles.searchListContainer, styles.container]}
                renderItem={RenderItem}
                data={filteredQuery}
            />
        </View>
    );
};

export default UploadArtistsList;