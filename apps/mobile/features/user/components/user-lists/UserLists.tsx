import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {spacing} from "@/theme";
import UserLatestReleases from "@/features/user/components/user-lists/UserLatestReleases";
import UserLatestNotes from "@/features/user/components/user-lists/UserLatestNotes";
import UserTopPicks from "@/features/user/components/user-lists/UserTopPicks";
import {useFocusEffect} from "expo-router";
import {initialFilterStore, useFilterStoreSelectors} from "@/features/filter/store/filter";
import useSingleUserContext from "@/features/user/hooks/useSingleUserContext";
import BestRatedTracks from "@/features/charts/components/BestRatedTracks";
import MostPopularTracks from "@/features/charts/components/MostPopularTracks";
import MostListenedTracks from "@/features/charts/components/MostListenedTracks";

interface UserListsProps {

}

const UserLists = ({}: UserListsProps) => {

    const user = useSingleUserContext()

    const setFilterState = useFilterStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.xl
            },
        })
    }, []);

    useFocusEffect(() => {
        setFilterState({ ...initialFilterStore, user })
    })

    return(
        <View style={styles.wrapper}>
            <BestRatedTracks />
            <MostPopularTracks />
            <MostListenedTracks />
            <UserLatestReleases />
            {/*<UserLatestAlbums />*/}
            <UserLatestNotes />
            <UserTopPicks />
        </View>
    )
}

export default UserLists