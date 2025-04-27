import {DeviceEventEmitter, StyleSheet, TouchableOpacity} from 'react-native'
import {useCallback, useMemo} from "react";
import {palette} from "@/theme";
import {useCommentContext} from "@/features/comment/context/CommentContextProvider";
import Text from "@/common/components/Text";

interface CommentRowActionsProps {

}

const CommentRowActions = ({}: CommentRowActionsProps) => {

    const comment = useCommentContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            action: {
                color: palette.olive,
                fontWeight: 'bold'
            }
        })
    }, []);

    const triggerReply = useCallback(() => {
        DeviceEventEmitter.emit('comments:reply:trigger', {
            comment: comment,
            entity: comment.getEntity(),
            entityID: comment.getEntityID(),
        })
    }, [])

    return(
        <TouchableOpacity onPress={triggerReply}>
            <Text style={styles.action}>
                Reply
            </Text>
        </TouchableOpacity>
    )
}

export default CommentRowActions