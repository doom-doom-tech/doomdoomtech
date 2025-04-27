import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import {palette, spacing} from "@/theme";
import NoteAttachments from "@/features/note/components/NoteAttachments";
import NoteText from "@/features/note/components/NoteText";

interface NoteTileContentProps {
    maxLength?: number; // New prop to limit text size
}

const NoteContent = ({ maxLength }: NoteTileContentProps) => {
    const note = useNoteContext();
    const content = note.getContent();

    // Apply max length if provided
    const displayText = maxLength && content.length > maxLength
        ? content.substring(0, maxLength) + "..."
        : content;

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
                paddingHorizontal: spacing.m
            },
            text: {
                fontSize: 24,
                fontWeight: "500",
                color: palette.offwhite
            }
        })
    }, []);

    return (
        <View style={styles.wrapper}>
            <NoteText />
            <NoteAttachments />
        </View>
    );
}

export default NoteContent;