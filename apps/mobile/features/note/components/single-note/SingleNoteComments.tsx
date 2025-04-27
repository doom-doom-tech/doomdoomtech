import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import NoteComments from "@/features/note/components/NoteComments";
import {spacing} from "@/theme";

interface SingleNoteCommentsProps {

}

const SingleNoteComments = ({}: SingleNoteCommentsProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingHorizontal: spacing.m
            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <NoteComments />
        </View>
    )
}

export default SingleNoteComments