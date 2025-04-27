import {StyleSheet, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import Comment from "@/features/comment/classes/Comment";
import {spacing} from "@/theme";
import _ from "lodash";
import CommentContextProvider from "@/features/comment/context/CommentContextProvider";
import CommentRowContent from "@/features/comment/components/comment-row/CommentRowContent";
import CommentRowReplies from "@/features/comment/components/comment-row/CommentRowReplies";

interface CommentRowProps {
    comment: Comment
    onDelete?: () => unknown
    disableLongPress?: boolean
    hideReplies?: boolean
    hideActions?: boolean
}

const CommentRow = ({disableLongPress, hideActions, hideReplies, comment, onDelete = _.noop}: CommentRowProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                width: '100%',
                gap: spacing.m,
            },
        })
    }, []);

    const Replies = useCallback(() => {
        if(hideReplies) return <Fragment />
        return <CommentRowReplies />
    }, [hideReplies])

    return(
        <CommentContextProvider comment={comment}>
            <View style={styles.wrapper}>
                <CommentRowContent
                    hideActions={hideActions}
                    disableLongPress={disableLongPress ?? false} />
                <Replies />
            </View>
        </CommentContextProvider>
    )
}

export default CommentRow