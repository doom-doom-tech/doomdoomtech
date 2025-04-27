import {StyleSheet, View} from 'react-native'
import {Fragment, useMemo} from "react";
import TrackRow from "@/features/track/components/track-row/TrackRow";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";

interface NoteTrackProps {

}

const NoteTrack = ({}: NoteTrackProps) => {

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
            <TrackContextProvider track={note.getTrack()!}>
                <TrackRow type={'route'} />
            </TrackContextProvider>
        </View>
    )
}

export default NoteTrack