import {StyleSheet, View, TouchableOpacity} from 'react-native'
import {useCallback, useMemo} from "react";
import {ImagePickerAsset} from "expo-image-picker";
import {Image} from "expo-image";
import {useVideoPlayer, VideoView} from "expo-video";
import {useCreateNoteStoreSelectors} from "@/features/note/store/create-note";
import {palette} from "@/theme";
import Close from "@/assets/icons/Close";

interface CreateNoteAttachmentProps {
    attachment: ImagePickerAsset
}

const CreateNoteAttachment = ({attachment}: CreateNoteAttachmentProps) => {
    const setCreateNoteState = useCreateNoteStoreSelectors.setState()
    const attachments = useCreateNoteStoreSelectors.attachments()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'relative'
            },
            attachment: {
                width: 80,
                height: 80
            },
            removeButton: {
                position: 'absolute',
                top: 0,
                right: 0,
                borderRadius: 12,
                padding: 4,
                zIndex: 1
            }
        })
    }, []);

    const handleRemove = useCallback(() => {
        const newAttachments = attachments.filter(a => a.uri !== attachment.uri)
        setCreateNoteState({ attachments: newAttachments })
    }, [attachment, attachments, setCreateNoteState])

    const player = useVideoPlayer(attachment.uri, player => {
        player.staysActiveInBackground = false
        player.allowsExternalPlayback = false
        player.loop = true
        player.muted = true

        player.play()
    })

    const RenderItem = useCallback(() => {
        return attachment.type === 'image'
            ? <Image source={attachment.uri} style={styles.attachment}/>
            : <VideoView player={player} style={styles.attachment} />
    }, [attachment, player, styles])

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
                <Close color={palette.offwhite} />
            </TouchableOpacity>
            <RenderItem />
        </View>
    )
}

export default CreateNoteAttachment