import {ScrollView, StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import UserRow from "@/features/user/components/user-row/UserRow";
import User from "@/features/user/classes/User";
import {router} from "expo-router";
import {useArtistsStoreSelectors} from "@/features/track/store/artists";
import Header from "@/common/components/header/Header";
import _ from 'lodash';
import UserContextProvider from "@/features/user/context/UserContextProvider";
import {spacing} from "@/theme";
import {wait} from "@/common/services/utilities";
import Label from "@/features/label/classes/Label";
import LabelRow from "@/features/user/components/label-row/LabelRow";
import LabelContextProvider from "@/features/label/context/LabelContextProvider";

interface TrackArtistsProps {

}

const TrackArtists = ({}: TrackArtistsProps) => {

    const artists = useArtistsStoreSelectors.artists()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            container: {
                gap: spacing.m,
                paddingHorizontal: spacing.m
            }
        })
    }, []);

    const handleRouteArtist = useCallback((user: User) => async () => {
        router.back()
        await wait(200)
        router.push(`/user/${user.getID()}`)
    }, [])

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<User>) => (
        <UserRow type={'follow'} callback={handleRouteArtist(item)} />
    ), [])

    return(
        <View style={styles.wrapper}>
            <Header title={"Artists"} />
            <ScrollView contentContainerStyle={styles.container}>
                { _.map(artists, (artist: User, index) => artist.isLabel() ? (
                    <LabelContextProvider label={artist as unknown as Label} key={artist.getID()}>
                        <LabelRow type={'follow'}/>
                    </LabelContextProvider>
                        ) : (
                    <UserContextProvider user={artist}>
                        <UserRow type={'follow'} callback={handleRouteArtist(artist)} />
                    </UserContextProvider>
                ))}
            </ScrollView>
        </View>
    )
}

export default TrackArtists