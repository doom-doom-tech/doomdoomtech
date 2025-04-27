import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo} from "react";
import CommentRow from "@/features/comment/components/comment-row/CommentRow";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import Comment from "@/features/comment/classes/Comment"
import {palette, spacing} from "@/theme";
import _ from "lodash";
import {router} from "expo-router";

interface FeedNoteCommentsProps {

}

const NoteComments = ({}: FeedNoteCommentsProps) => {

    const note = useNoteContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m
            },
            trigger: {
                fontWeight: 'bold',
                color: palette.granite,
            }
        })
    }, []);

    const comments = useMemo(() => {
        if(!note.getComments() || _.isEmpty(note.getComments())) return []
        return note.getComments().map(comment => new Comment(comment))
    }, [note])

    const handleTriggerComments = useCallback(() => {
        router.push(`/(sheets)/comments/Note/${note.getID()}`)
    }, [note])

    return(
        <View style={styles.wrapper}>
            { comments.map((comment: Comment, _) => (
                <CommentRow
                    disableLongPress
                    hideReplies
                    hideActions
                    comment={comment}
                    key={comment.getID()}
                />
            ))}
            { Boolean(comments.length) && (
                <TouchableOpacity onPress={handleTriggerComments}>
                    <Text style={styles.trigger}>
                        View all comments
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

export default NoteComments