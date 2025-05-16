import {StyleSheet, View} from 'react-native'
import {useEffect, useMemo} from "react";
import NoteHeader from "@/features/note/components/NoteHeader";
import NoteText from "@/features/note/components/NoteText";
import NoteAttachments from "@/features/note/components/NoteAttachments";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import {palette, spacing} from "@/theme";
import NoteGradientBackground from "@/features/note/components/NoteGradientBackground";
import Loop from "@/assets/icons/Loop";
import _ from "lodash";
import useMediaActions from "@/common/hooks/useMediaActions";
import Track from "@/features/track/classes/Track";
import TrackPlayer, {useActiveTrack} from "react-native-track-player";

interface SingleNoteContentProps {

}

const SingleNoteContent = ({}: SingleNoteContentProps) => {

    const note = useNoteContext()
    const { loadTrack } = useMediaActions()
    const current = useActiveTrack()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
                paddingVertical: note.looped() ? spacing.m : 0,
                marginHorizontal: note.looped() ? spacing.m : 0,
            },
            content: {
                color: palette.offwhite,
                fontSize: 24,
            },
            gradient: {
                ...StyleSheet.absoluteFillObject,
                borderRadius: 4,
                opacity: 0.6
            }
        })
    }, [note]);

    // Play the pinned track
    useEffect(() => {
        if(note.getTrack()) {
            if(current && current.id === note.getTrack()!.getID()) {
                TrackPlayer.play()
                return
            }
            note.getTrack() && loadTrack(note.getTrack() as Track)
        }
    }, [])

    return(
        <View style={styles.wrapper}>
            <NoteGradientBackground />
            { note.looped() && <NoteHeader user={note.getUser()} callback={_.noop} type={'custom'} ContentRight={Loop} />}
            <NoteText />
            <NoteAttachments />
        </View>
    )
}

export default SingleNoteContent