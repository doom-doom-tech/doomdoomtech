import {KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import Header from "@/common/components/header/Header";
import CreateNoteHeader from "@/features/note/components/create-note/CreateNoteHeader";
import CreateNoteInput from "@/features/note/components/create-note/CreateNoteInput";
import CreateNoteAttachments from "@/features/note/components/create-note/CreateNoteAttachments";
import CreateNoteTracks from "@/features/note/components/create-note/CreateNoteTracks";
import {palette, spacing} from "@/theme";
import ActionText from "@/common/components/ActionText";
import {extractTypeFromMimetype, formatServerErrorResponse, uploadFile, wait} from "@/common/services/utilities";
import {TOASTCONFIG} from "@/common/constants";
import Toast from "react-native-root-toast";
import useNoteCreate from "@/features/note/hooks/useNoteCreate";
import {useCreateNoteValues} from "@/features/note/store/create-note";
import {router} from "expo-router";
import CreateNoteTrack from "@/features/note/components/create-note/CreateNoteTrack";
import * as Crypto from "expo-crypto";
import CreateNoteLimit from "@/features/note/components/create-note/CreateNoteLimit";
import {usePaymentContext} from "@/common/context/PaymentContextProvider";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";

const CreateNote = () => {

    const createNoteValues = useCreateNoteValues()

    const createNoteMutation = useNoteCreate()

    const [loading, setLoading] = useState<boolean>(false)

    const { premiumMember } = usePaymentContext()
    const user = useGlobalUserContext()

    const DAILY_LIMIT = premiumMember ? 10 : 3
    const POSTED_COUNT = user?.getSettings().daily_notes ?? 0

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1
            },
            content: {
                flex: 1,
                position: 'relative',
            },
            buttonContainer: {
                padding: spacing.m,
                backgroundColor: palette.black,
            },
        });
    }, []);

    const handleCreateNote = useCallback(async () => {
        try {
            if(DAILY_LIMIT - POSTED_COUNT === 0 && !premiumMember)
                return router.push('/paywall')

            if(DAILY_LIMIT - POSTED_COUNT === 0)
                return Toast.show('You have reached your daily limit', TOASTCONFIG.error)

            setLoading(true)

            if(!createNoteValues.content) {
                return Toast.show('Write something first', TOASTCONFIG.error)
            }

            const uuid = Crypto.randomUUID()

            let attachments = []

            for(let attachment of createNoteValues.attachments) {
                attachments.push({
                    url: await uploadFile(attachment, uuid, 'note.attachment') || '',
                    type: extractTypeFromMimetype(attachment.mimeType as string),
                })
            }

            const payload = {
                uuid: uuid,
                attachments,
                content: createNoteValues.content,
                trackID: createNoteValues.track?.getID()
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
    }, [createNoteValues, DAILY_LIMIT, POSTED_COUNT])

    const HeaderRightComponent = () => {
        return <ActionText
            disabled={DAILY_LIMIT - POSTED_COUNT === 0}
            loading={loading}
            label={"Post"}
            callback={handleCreateNote}
        />
    }

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
                <CreateNoteLimit />
                <CreateNoteTrack />
                <CreateNoteTracks/>
            </View>
        </KeyboardAvoidingView>
    );
}

export default CreateNote