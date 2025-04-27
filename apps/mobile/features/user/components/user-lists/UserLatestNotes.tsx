import {StyleSheet, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import Block from "@/common/components/block/Block";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import Note from "@/features/note/classes/Note";
import NoteTile from "@/features/note/components/note-tile/NoteTile";
import useUserNotes from "@/features/user/hooks/useUserNotes";
import useSingleUserContext from "@/features/user/hooks/useSingleUserContext";
import {extractItemsFromInfinityQuery} from "@/common/services/utilities";
import {router} from "expo-router";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import NoteContextProvider from "@/features/note/context/NoteContextProvider";

interface UserLatestNotesProps {

}

const UserLatestNotes = ({}: UserLatestNotesProps) => {

    const user = useSingleUserContext()

    const setFilterState = useFilterStoreSelectors.setState()

    const userNotesQuery = useUserNotes({ userID: user.getID() })

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const routeAdditionalTracks = useCallback(() => {
        setFilterState({ user: user })
        router.push('/list/userNotes')
    }, [])

    const RenderItem = useCallback(({item}: ListRenderItemPropsInterface<Note>) => (
        <NoteContextProvider note={item} key={item.getID()}>
            <NoteTile />
        </NoteContextProvider>
    ), [])

    if(!extractItemsFromInfinityQuery(userNotesQuery.data).length) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <Block <Note> infinite query={userNotesQuery} title={"Latest notes"} subtitle={"View all"} callback={routeAdditionalTracks} renderItem={RenderItem} />
        </View>
    )
}

export default UserLatestNotes