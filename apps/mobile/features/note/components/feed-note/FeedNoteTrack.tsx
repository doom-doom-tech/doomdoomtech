import {StyleSheet, View} from 'react-native'
import {Fragment, useMemo} from "react";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import TrackRow from "@/features/track/components/track-row/TrackRow";

interface FeedNoteTrackProps {

}

const FeedNoteTrack = ({}: FeedNoteTrackProps) => {

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
            <TrackContextProvider track={note.getTrack()}>
                <TrackRow type={'route'} />
            </TrackContextProvider>
        </View>
    )
}

export default FeedNoteTrack