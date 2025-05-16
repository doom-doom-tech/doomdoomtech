import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import {useCreateNoteStoreSelectors} from "@/features/note/store/create-note";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import TrackRow from "@/features/track/components/track-row/TrackRow";
import {spacing} from "@/theme";

interface CreateNoteTrackProps {

}

const CreateNoteTrack = ({}: CreateNoteTrackProps) => {

    const track = useCreateNoteStoreSelectors.track()

    const { width } = useWindowDimensions()

    const setCreateNoteState = useCreateNoteStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingVertical: spacing.m
            },
        })
    }, []);

    const handleDeselectTrack = useCallback(() => {
        setCreateNoteState({ track: null })
    }, [])

    if(!track) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <TrackContextProvider track={track}>
                <TrackRow type={'remove'} onRemove={handleDeselectTrack} />
                {/*<CreateNoteTrackConfig />*/}
            </TrackContextProvider>
        </View>
    )
}

export default CreateNoteTrack