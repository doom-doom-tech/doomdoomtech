import {StyleSheet, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import Header from "@/common/components/header/Header";
import {spacing} from "@/theme";
import {LinearGradient} from "expo-linear-gradient";
import NoteContextProvider from "@/features/note/context/NoteContextProvider";
import {useNoteStoreSelectors} from "@/features/note/store/note";
import Button from "@/common/components/buttons/Button"
import useNoteLoop from "@/features/note/hooks/useNoteLoop";
import {formatServerErrorResponse, wait} from "@/common/services/utilities";
import {TOASTCONFIG} from "@/common/constants";
import Toast from "react-native-root-toast";
import {router} from "expo-router";
import GlobalUserContextProvider from "@/features/user/context/GlobalUserContextProvider";
import NoteText from "@/features/note/components/NoteText";
import NoteHeader from "@/features/note/components/NoteHeader";
import NoteAttachments from "@/features/note/components/NoteAttachments";

interface LoopNoteProps {

}

const LoopNote = ({}: LoopNoteProps) => {

    const note = useNoteStoreSelectors.note()

    const loopNoteMutation = useNoteLoop()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
                paddingHorizontal: spacing.m,
            },
            content: {
                width: '100%', height: 'auto',
                paddingVertical: spacing.m,
                borderRadius: 4,
                gap: spacing.m,
                overflow: 'hidden'
            },
            gradient: {
                ...StyleSheet.absoluteFillObject,
                opacity: 0.6,
            },
            icon: {
                position: 'absolute',
                top: spacing.m,
                right: spacing.m,
            }
        })
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            if(!note) return

            await loopNoteMutation.mutateAsync({
                noteID: note?.getID()
            })

            router.back()
            await wait(200)
            Toast.show('Note looped', TOASTCONFIG.success)
        } catch (error: any) {
            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error)
        }
    }, [note]);

    if(!note) return <Fragment />

    return(
        <GlobalUserContextProvider>
            <NoteContextProvider note={note}>
                <View style={styles.wrapper}>
                    <Header title={"Loop this note"} />
                    <View style={styles.content}>
                        <LinearGradient colors={['#CE5846', '#501D5F']} style={styles.gradient} />
                        <NoteHeader type={'no-action'} user={note.getUser()} />
                        <NoteText />
                        <NoteAttachments />
                    </View>
                    <Button
                        disabled={!note}
                        fill={"rose"}
                        label={"Loop"}
                        callback={handleSubmit}
                    />
                </View>
            </NoteContextProvider>
        </GlobalUserContextProvider>
    )
}

export default LoopNote