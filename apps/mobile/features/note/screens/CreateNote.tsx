import {ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import Header from "@/common/components/header/Header";
import CreateNoteHeader from "@/features/note/components/create-note/CreateNoteHeader";
import CreateNoteInput from "@/features/note/components/create-note/CreateNoteInput";
import CreateNoteAttachments from "@/features/note/components/create-note/CreateNoteAttachments";
import CreateNoteTracks from "@/features/note/components/create-note/CreateNoteTracks";
import {palette, spacing} from "@/theme";
import ActionText from "@/common/components/ActionText";
import {extractTypeFromMimetype, formatServerErrorResponse, wait} from "@/common/services/utilities";
import {TOASTCONFIG} from "@/common/constants";
import Toast from "react-native-root-toast";
import {API_BASE_URL, STORAGE_KEYS} from "@/common/services/api";
import useNoteCreate from "@/features/note/hooks/useNoteCreate";
import {useCreateNoteValues} from "@/features/note/store/create-note";
import {router} from "expo-router";
import CreateNoteTrack from "@/features/note/components/create-note/CreateNoteTrack";
import {DocumentPickerAsset} from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import _ from "lodash";
import * as Crypto from "expo-crypto";
import {ImagePickerAsset} from "expo-image-picker";

const CreateNote = () => {

    const createNoteValues = useCreateNoteValues()

    const createNoteMutation = useNoteCreate()

    const [loading, setLoading] = useState<boolean>(false)

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1
            },
            content: {
                flex: 1
            },
            buttonContainer: {
                padding: spacing.m,
                backgroundColor: palette.black,
            },
        });
    }, []);

    const uploadFile = useCallback(async (file: DocumentPickerAsset | ImagePickerAsset, uuid: string) => {
        try {
            const bearer = await AsyncStorage.getItem(STORAGE_KEYS.AUTH)

            const endpoint = `/media/upload?uuid=${uuid}&purpose=note.attachment`

            const response = await FileSystem.uploadAsync(API_BASE_URL + endpoint, file.uri, {
                httpMethod: 'PUT',
                fieldName: 'file',
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                headers: {
                    'Authorization': String(bearer),
                    'Content-Type': 'multipart/form-data',
                },
            });

            return _.get(JSON.parse(response.body), 'data.upload.url', '')
        } catch (error) {

        }
    }, [])

    const handleCreateNote = useCallback(async () => {
        try {
            setLoading(true)

            if(!createNoteValues.content) {
                return Toast.show('Write something first', TOASTCONFIG.error)
            }

            const uuid = Crypto.randomUUID()

            const payload = new FormData()

            let attachments = []

            for(let attachment of createNoteValues.attachments) {
                attachments.push({
                    url: await uploadFile(attachment, uuid) || '',
                    type: extractTypeFromMimetype(attachment.mimeType as string),
                })
            }

            payload.append('attachments', JSON.stringify(attachments));

            payload.append('content', createNoteValues.content)

            if(createNoteValues.track) {
                payload.append('trackID', String(createNoteValues.track.getID()))
            }

            await createNoteMutation.mutateAsync(payload)

            router.back()
            await wait(200)
            Toast.show("Note created", TOASTCONFIG.success)
        } catch (error: any) {
            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error)
        } finally {
            setLoading(false)
        }
    }, [createNoteValues])

    const HeaderRightComponent = useCallback(() => {
        return loading
            ? <ActivityIndicator color={palette.olive} />
            : <ActionText label={"Post"} callback={handleCreateNote}/>
    }, [loading, handleCreateNote])

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80}
            style={styles.wrapper}>
            <Header title={"Create Note"} RightComponent={HeaderRightComponent}/>
            <View style={styles.content}>
                <CreateNoteHeader/>
                <CreateNoteInput/>
                <CreateNoteAttachments/>
                <CreateNoteTrack />
                <CreateNoteTracks/>
            </View>
        </KeyboardAvoidingView>
    );
}

export default CreateNote