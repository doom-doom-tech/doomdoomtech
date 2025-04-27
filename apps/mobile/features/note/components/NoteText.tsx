import {StyleSheet} from 'react-native'
import {useMemo} from "react";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import {palette, spacing} from "@/theme";
import Text from "@/common/components/Text"

interface NoteTextProps {
    maxLength?: number
}

const NoteText = ({maxLength}: NoteTextProps) => {

    const note = useNoteContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            content: {
                color: palette.offwhite,
                paddingHorizontal: spacing.m,
                fontSize: 24,
            }
        })
    }, []);

    const displayText = maxLength && note.getContent().length > maxLength
        ? note.getContent().substring(0, maxLength) + "..."
        : note.getContent();

    return(
        <Text style={styles.content}>
            {displayText}
        </Text>
    )
}

export default NoteText