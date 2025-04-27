import {DeviceEventEmitter, StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import Screen from "@/common/components/Screen";
import SearchBar from "@/common/components/SearchBar";
import Header from "@/common/components/header/Header";
import {spacing} from '@/theme';
import {useFocusEffect} from "expo-router";
import SearchTrackResults from "@/features/search/components/search/SearchTrackResults";
import SearchUserResults from "@/features/search/components/search/SearchUserResults";
import SearchNoteResults from "@/features/search/components/search/SearchNoteResults";
import Scroll from "@/common/components/Scroll";

interface SearchProps {

}

const Search = ({}: SearchProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.l,
                paddingTop: spacing.l,
                paddingBottom: 200,
            },
            header: {
                paddingHorizontal: spacing.m
            }
        })
    }, []);

    useFocusEffect(() => {
        DeviceEventEmitter.emit('search:focus')
    })

    return(
        <Screen>
            <Header title={"Search"} />

            <View style={styles.header}>
                <SearchBar />
            </View>

            <Scroll contentContainerStyle={styles.wrapper}>
                <SearchTrackResults />
                <SearchUserResults />
                <SearchNoteResults />
            </Scroll>
        </Screen>
    )
}

export default Search