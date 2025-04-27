import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo, useRef, useState} from "react";
import Input from "@/common/components/inputs/Input";
import {palette, spacing} from "@/theme";
import useCommentPost from "@/features/comment/hooks/useCommentPost";
import Toast from "react-native-root-toast";
import {formatServerErrorResponse} from "@/common/services/utilities";
import {TOASTCONFIG} from "@/common/constants";
import {CommentableEntity, TriggerCommentReplyRequest} from "@/features/comment/types/requests";
import ArrowUp from "@/assets/icons/ArrowUp";
import useEventListener from "@/common/hooks/useEventListener";
import {useAlgoliaEvents} from "@/common/hooks/useAlgoliaEvents";

interface CommentsInputProps {
    entity: CommentableEntity
    entityID: number
}

const CommentsInput = ({entity, entityID}: CommentsInputProps) => {

    const inputReference = useRef<TextInput>()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'relative',
                paddingHorizontal: spacing.m,
            },
            input: {
                paddingRight: 60,
            },
            button: {
                position: 'absolute',
                width: 48,
                height: 48,
                right: 24,
                top: 12,
                backgroundColor: palette.olive,
                justifyContent: 'center',
                alignItems: 'center'
            }
        })
    }, []);

    const postCommentMutation = useCommentPost()

    const { commentOnTrack } = useAlgoliaEvents()

    const [content, setContent] = useState<string>('')
    const [parentID, setParentID] = useState<number | null>(null)

    const handleSubmitComment = useCallback(async () => {
        try {
            if(!content) return

            entity === 'Track' && commentOnTrack(entityID)

            let payload = {
                entity: entity,
                entityID: entityID,
                content: content,
            }

            parentID && (payload.parentID = parentID)

            await postCommentMutation.mutateAsync(payload)

            setContent('')
        } catch (error: any) {
            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error)
        }
    }, [entity, entityID, content, parentID])

    const handleTriggerReply = useCallback(({ entity: passedEntity, entityID: passedEntityID, comment }: TriggerCommentReplyRequest) => {
        if(entity === passedEntity && Number(entityID) === Number(passedEntityID)) {
            setParentID(comment.getParentID() ? comment.getParentID() : comment.getID())
            setContent(`@${comment.getSender().username} `)
            inputReference.current?.focus()
        }
    }, [entity, entityID])

    useEventListener('comments:reply:trigger', handleTriggerReply)

    return(
        <View style={styles.wrapper}>
            <Input
                value={content}
                ref={inputReference}
                inputStyle={styles.input}
                placeholder={"Write a comment"}
                onChangeText={setContent}
                onSubmitEditing={handleSubmitComment}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmitComment}>
                <ArrowUp />
            </TouchableOpacity>
        </View>
    )
}

export default CommentsInput