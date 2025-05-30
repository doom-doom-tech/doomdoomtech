import {useCallback} from "react";
import useNoteLatest from "@/features/note/hooks/useNoteLatest";
import Block from "@/common/components/block/Block";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import NoteContextProvider from "@/features/note/context/NoteContextProvider";
import Note from "@/features/note/classes/Note";
import NoteTile from "@/features/note/components/note-tile/NoteTile";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import useEventListener from "@/common/hooks/useEventListener";
import {router} from "expo-router";

const LatestNotes = () => {

    const period = useFilterStoreSelectors.period()
    const subgenre = useFilterStoreSelectors.subgenre()
    const genre = useFilterStoreSelectors.genre()
    const tag = useFilterStoreSelectors.label()

    const latestNotesQuery = useNoteLatest({
        period: period.value, genreID: genre?.getID(), subgenreID: subgenre?.getID(), labelTag: tag
    })

    const RenderItem = useCallback(({item}: ListRenderItemPropsInterface<Note>) => (
        <NoteContextProvider note={item}>
            <NoteTile />
        </NoteContextProvider>
    ), [])

    const routeAdditionalTracks = useCallback(() => {
        router.push('/list/latestNotes')
    }, [])

    useEventListener('charts:refetch', latestNotesQuery.refetch)

    return(
        <Block
            <Note>
            title={"Latest notes"}
            subtitle={"View all"}
            callback={routeAdditionalTracks}
            query={latestNotesQuery}
            renderItem={RenderItem}
        />
    )
}

export default LatestNotes