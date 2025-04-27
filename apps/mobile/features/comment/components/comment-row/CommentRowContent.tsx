import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo} from "react";
import CommentRowUserImage from "@/features/comment/components/comment-row/CommentRowUserImage";
import CommentRowText from "@/features/comment/components/comment-row/CommentRowText";
import {useCommentContext} from "@/features/comment/context/CommentContextProvider";
import {formatServerErrorResponse} from "@/common/services/utilities";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import CommentRowSender from "@/features/comment/components/comment-row/CommentRowSender";
import CommentRowLikes from "@/features/comment/components/comment-row/CommentRowLikes";
import {spacing} from "@/theme";
import useCommentDelete from "@/features/comment/hooks/useCommentDelete";
import {useActionSheet} from "@expo/react-native-action-sheet";
import CommentRowActions from "@/features/comment/components/comment-row/CommentRowActions";

interface CommentRowContentProps {
    disableLongPress?: boolean
    hideActions?: boolean
}

const CommentRowContent = ({hideActions, disableLongPress}: CommentRowContentProps) => {

    const comment = useCommentContext()

    const deleteCommentMutation = useCommentDelete()
    const { showActionSheetWithOptions } = useActionSheet()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flexDirection: 'row',
                justifyContent: 'space-between',
            },
            left: {
                gap: spacing.m,
                flexDirection: 'row'
            }
        })
    }, []);

    const triggerCommentActions = useCallback(() => {
        if(disableLongPress) return
        showActionSheetWithOptions({
            options: ['Report', 'Delete', 'Cancel'],
            cancelButtonIndex: 2,
            destructiveButtonIndex: 1,
        }, async (index) => {
            if (index === 0) return
            if (index === 1) return handleDeleteComment()
            if (index === 2) return
        })
    }, [disableLongPress])

    const handleDeleteComment = useCallback(async () => {
        try {
            await deleteCommentMutation.mutateAsync({
                commentID: comment.getID()
            })

            Toast.show('Comment deleted', TOASTCONFIG.success)
        } catch (error: any) {
            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error)
        }
    }, [])

    return (
        <TouchableOpacity style={styles.wrapper} onLongPress={triggerCommentActions}>
            <View style={styles.left}>
                <CommentRowUserImage/>
                <View>
                    <CommentRowSender />
                    <CommentRowText/>
                    { !hideActions && <CommentRowActions/> }
                </View>
            </View>
            <CommentRowLikes />
        </TouchableOpacity>
    )
}

export default CommentRowContent