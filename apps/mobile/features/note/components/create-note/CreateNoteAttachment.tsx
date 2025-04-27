import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {ImagePickerAsset} from "expo-image-picker";
import {Image} from "expo-image";
import {useVideoPlayer, VideoView} from "expo-video";

interface CreateNoteAttachmentProps {
    attachment: ImagePickerAsset
}

const CreateNoteAttachment = ({attachment}: CreateNoteAttachmentProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            attachment: {
                width: 80,
                height: 80
            }
        })
    }, []);

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
        <View>
            <RenderItem />
        </View>
    )
}

export default CreateNoteAttachment