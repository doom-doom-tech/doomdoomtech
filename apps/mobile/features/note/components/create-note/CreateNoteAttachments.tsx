import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Gallery from "@/assets/icons/Gallery";
import {palette, spacing} from "@/theme";
import * as ImagePicker from "expo-image-picker"
import {useCreateNoteStoreSelectors} from "@/features/note/store/create-note";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import _ from "lodash";
import CreateNoteAttachment from "@/features/note/components/create-note/CreateNoteAttachment";

interface CreateNoteAttachmentProps {

}

const CreateNoteAttachments = ({}: CreateNoteAttachmentProps) => {

    const setCreateNoteState = useCreateNoteStoreSelectors.setState()
    const attachments = useCreateNoteStoreSelectors.attachments()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                padding: spacing.m,
                borderBottomWidth: 1,
                borderColor: palette.offwhite
            },
            attachment: {
                width: 60,
                height: 60,
            }
        })
    }, []);

    const triggerLibrary = useCallback(async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            selectionLimit: 5,
            orderedSelection: true,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if(result.canceled) return Toast.show('Upload cancelled', TOASTCONFIG.warning)

        setCreateNoteState({
            attachments: [...attachments, ...result.assets]
        })
    }, [attachments])

    if(attachments.length) return(
        <View style={styles.wrapper}>
            <ScrollView horizontal contentContainerStyle={{ gap: spacing.s }}>
                {_.map(attachments, attachment => (
                    <CreateNoteAttachment attachment={attachment} />
                ))}
            </ScrollView>
        </View>
    )

    return(
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={triggerLibrary}>
                <Gallery color={palette.offwhite} />
            </TouchableOpacity>
        </View>
    )
}

export default CreateNoteAttachments