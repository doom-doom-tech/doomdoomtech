import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import {palette, spacing, styling} from "@/theme";
import NoteText from "@/features/note/components/NoteText";
import NoteAttachments from "@/features/note/components/NoteAttachments";
import NoteHeader from "@/features/note/components/NoteHeader";
import NoteGradientBackground from "@/features/note/components/NoteGradientBackground";
import Loop from "@/assets/icons/Loop";
import {router} from "expo-router";

interface FeedNoteContentProps {

}

const FeedNoteContent = ({}: FeedNoteContentProps) => {

    const note = useNoteContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingVertical: note.looped() ? spacing.m : 0,
                marginHorizontal: note.looped() ? spacing.m : 0
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

    const handleRouteUser = useCallback(() => {
        router.push(`/user/${note.getUser().getID()}`)
    }, [note])

    return(
        <View style={styles.wrapper}>
            <NoteGradientBackground />

            { note.looped() && (
                <NoteHeader user={note.getUser()} callback={handleRouteUser} type={'custom'} ContentRight={Loop} />
            )}

            <View style={styling.column.m}>
                <NoteText />
                <NoteAttachments />
            </View>

        </View>
    )
}

export default FeedNoteContent