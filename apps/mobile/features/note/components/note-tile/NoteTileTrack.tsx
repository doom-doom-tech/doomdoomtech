import {StyleSheet, View} from 'react-native'
import {Fragment, useMemo} from "react";
import NoteTrack from "@/features/note/components/NoteTrack";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";

interface NoteTileTrackProps {

}

const NoteTileTrack = ({}: NoteTileTrackProps) => {

    const note = useNoteContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    if(!note.getTrack()) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <NoteTrack />
        </View>
    )
}

export default NoteTileTrack