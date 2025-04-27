import {Dimensions, StyleSheet, TextInput, View} from 'react-native'
import {useCallback, useMemo, useRef, useState} from "react";
import Input from "@/common/components/inputs/Input";
import useCommentPost from "@/features/comment/hooks/useCommentPost";
import {formatServerErrorResponse} from "@/common/services/utilities";
import {TOASTCONFIG} from "@/common/constants";
import Toast from "react-native-root-toast";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import useEventListener from "@/common/hooks/useEventListener";
import {TriggerCommentReplyRequest} from "@/features/comment/types/requests";
import {useAlgoliaEvents} from "@/common/hooks/useAlgoliaEvents";

const { width: screenWidth } = Dimensions.get("window");

export interface NoteCommentInputProps {
    reply: string
    parentID: number
}

const NoteCommentInput = () => {

    const note = useNoteContext()

    const [value, setValue] = useState<string>('')
    const [parentID, setParentID] = useState<number | null>(null)

    const inputReference = useRef<TextInput>()

    const { commentOnNote } = useAlgoliaEvents()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                alignSelf: 'center',
                width: screenWidth - 32,
            },
        })
    }, []);

    const postCommentMutation = useCommentPost()

    const handlePostComment = useCallback(async () => {
        try {
            commentOnNote(note.getID())

            let payload = {
                entity: "Note",
                entityID: note.getID(),
                content: value,
            }

            parentID && (payload.parentID = parentID)

            await postCommentMutation.mutateAsync(payload)

            setValue('')
        } catch (error: any) {
            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error)
        }
    }, [note, value, parentID])

    const handleTriggerReply = useCallback(({ entity, entityID, comment }: TriggerCommentReplyRequest) => {
        if(entity === "Note" && entityID === note.getID()) {
            setParentID(comment.getParentID() ? comment.getParentID() : comment.getID())
            setValue(`@${comment.getSender().username} `)
            inputReference.current?.focus()
        }
    }, [])

    useEventListener('comments:reply:trigger', handleTriggerReply)

    return(
        <View style={styles.wrapper}>
            <Input
                ref={inputReference}
                value={value}
                placeholder={'Write a comment'}
                onChangeText={setValue}
                onSubmitEditing={handlePostComment}
            />
        </View>
    )
}

export default NoteCommentInput