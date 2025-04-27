import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {useSearchStoreSelectors} from "@/features/search/store/search";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import Block from "@/common/components/block/Block";
import NoteTile from "@/features/note/components/note-tile/NoteTile";
import NoteContextProvider from "@/features/note/context/NoteContextProvider";
import Note from "@/features/note/classes/Note";
import useNoteSearch from "@/features/note/hooks/useNoteSearch";

interface SearchTrackResultsProps {

}

const SearchNoteResults = ({}: SearchTrackResultsProps) => {

    const query = useSearchStoreSelectors.query()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const searchNotesQuery = useNoteSearch(query)

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Note>) => (
        <NoteContextProvider note={item}>
            <NoteTile />
        </NoteContextProvider>
    ), [])

    const routeAdditionalNotes = useCallback(() => {
        // TODO
    }, [])

    return(
        <View style={styles.wrapper}>
            <Block
                <Note>
                title={"Notes"}
                subtitle={"View all"}
                callback={routeAdditionalNotes}
                query={searchNotesQuery}
                renderItem={RenderItem}
            />
        </View>
    )
}

export default SearchNoteResults