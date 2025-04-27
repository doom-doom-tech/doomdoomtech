import {StyleSheet, TouchableOpacity} from 'react-native'
import {useCallback, useMemo} from "react";
import FeedNoteHeader from "@/features/note/components/feed-note/FeedNoteHeader";
import {palette, spacing} from "@/theme";
import FeedNoteContent from "@/features/note/components/feed-note/FeedNoteContent";
import FeedNoteMetrics from "@/features/note/components/feed-note/FeedNoteMetrics";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import {router} from "expo-router";
import FeedNoteComments from "@/features/note/components/feed-note/FeedNoteComments";
import {useAlgoliaEvents} from "@/common/hooks/useAlgoliaEvents";

const FeedNote = () => {

    const note = useNoteContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
                paddingVertical: spacing.l,
                borderBottomWidth: 2,
                borderColor: palette.granite
            },
            gradient: {
                ...StyleSheet.absoluteFillObject,
                opacity: 0.6,
            },
        })
    }, []);

    const { viewItem } = useAlgoliaEvents()

    const handleRouteNote  = useCallback(() => {
        viewItem(note.getID(), 'note')
        router.push(`/note/${note.getID()}`)
    }, [note])

    return(
        <TouchableOpacity style={styles.wrapper} activeOpacity={0.5} onPress={handleRouteNote}>
            <FeedNoteHeader />
            <FeedNoteContent />
            <FeedNoteMetrics />
            <FeedNoteComments />
        </TouchableOpacity>
    )
}

export default FeedNote