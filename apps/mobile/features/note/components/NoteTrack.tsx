import {StyleSheet, View} from 'react-native'
import {Fragment, useMemo} from "react";
import TrackRow from "@/features/track/components/track-row/TrackRow";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import Queueable from '@/common/components/Queueable';
import { convertToQueryResult } from '@/common/services/utilities';
import Track from '@/features/track/classes/Track';

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
            <Queueable query={convertToQueryResult<Track>([note.getTrack() as Track])}>
                <TrackContextProvider track={note.getTrack()!}>
                    <TrackRow type={'options'} disableRouting />
                </TrackContextProvider>
            </Queueable>
        </View>
    )
}

export default NoteTrack