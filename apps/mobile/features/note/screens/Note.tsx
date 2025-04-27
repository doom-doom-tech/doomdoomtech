import {DeviceEventEmitter, RefreshControl, ScrollView, StyleSheet, TouchableOpacity} from 'react-native'
import {Fragment, useCallback, useMemo, useState} from "react";
import Screen from "@/common/components/Screen";
import NoteContextProvider from "@/features/note/context/NoteContextProvider";
import {router, useLocalSearchParams} from "expo-router";
import useNote from "@/features/note/hooks/useNote";
import {palette, spacing} from "@/theme";
import SingleNoteContent from "@/features/note/components/single-note/SingleNoteContent";
import SingleNoteMetrics from "@/features/note/components/single-note/SingleNoteMetrics";
import SingleNoteComments from "@/features/note/components/single-note/SingleNoteComments";
import Header from "@/common/components/header/Header";
import SingleNoteHeader from "@/features/note/components/single-note/SingleNoteHeader";
import useEventListener from "@/common/hooks/useEventListener";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import More from "@/assets/icons/More";
import {useActionSheet} from "@expo/react-native-action-sheet";
import useNoteDelete from "@/features/note/hooks/useNoteDelete";
import Toast from "react-native-root-toast";
import {formatServerErrorResponse, wait} from "@/common/services/utilities";
import {TOASTCONFIG} from "@/common/constants";
import {useReportStoreSelectors} from "@/common/store/report";

const Note = () => {

    const user = useGlobalUserContext()

    const { id } = useLocalSearchParams()

    const { showActionSheetWithOptions } = useActionSheet()

    const deleteNoteMutation = useNoteDelete()

    const noteQuery = useNote({ noteID: Number(id) })

    const [refreshing, setRefreshing] = useState(false)

    const setReportState = useReportStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            container: {
                gap: spacing.m,
                paddingBottom: 400,
                position: 'relative'
            },
            commentsContainer: {
                borderTopWidth: 1,
                borderColor: "#ccc",
                padding: spacing.m,
                backgroundColor: "white",
            }
        })
    }, []);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true)

        DeviceEventEmitter.emit('comments:refetch')
        DeviceEventEmitter.emit('replies:refetch')
        DeviceEventEmitter.emit('notes:refetch')

        await noteQuery.refetch()

        setTimeout(() => setRefreshing(false), 2000)
    }, [])

    const RefreshControlComponent = useMemo(() => {
        return <RefreshControl tintColor={palette.olive} refreshing={refreshing} onRefresh={handleRefresh} />
    }, [refreshing, handleRefresh])

    const handleDeleteNote = useCallback(async () => {
        try {
            if(!noteQuery.data) return

            await deleteNoteMutation.mutateAsync({
                noteID: noteQuery.data.getID()
            })

            router.back()
            await wait(200)
            Toast.show('Note deleted', TOASTCONFIG.success)
        } catch (error: any) {
            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error)
        }
    }, [])

    const handleTriggerReport = useCallback(async () => {
        if(!noteQuery.data) return
        setReportState({
            entityType: "Note", entityID: noteQuery.data.getID()
        })
        router.push('/(sheets)/report')
    }, [noteQuery.data])

    const owned = useMemo(() => user?.getID() === noteQuery.data?.getUser().getID(), [user, noteQuery.data])

    const handleToggleOptions = useCallback(() => {
        showActionSheetWithOptions({
            options: owned ? ['Delete', 'Cancel'] : ['Report', 'Cancel'],
            cancelButtonIndex: 1,
            destructiveButtonIndex: 0,
        }, async (index) => {
            if (index === 0) return owned ? handleDeleteNote() : handleTriggerReport()
            if (index === 1) return
        })
    }, [owned, handleDeleteNote, handleTriggerReport])

    const RightComponent = useCallback(() => {
        return(
            <TouchableOpacity onPress={handleToggleOptions}>
                <More />
            </TouchableOpacity>
        )
    }, [noteQuery])

    useEventListener('notes:refetch', noteQuery.refetch)

    if(noteQuery.isLoading || noteQuery.isError || !noteQuery.data) return <Fragment />

    return (
        <Screen>
            <NoteContextProvider note={noteQuery.data}>
                <Header title={noteQuery.data.getContent().substring(0, 15) + '...'} RightComponent={RightComponent} />
                <ScrollView contentContainerStyle={styles.container} refreshControl={RefreshControlComponent}>
                    <SingleNoteHeader />
                    <SingleNoteContent />
                    <SingleNoteMetrics />
                    <SingleNoteComments />
                </ScrollView>
            </NoteContextProvider>
        </Screen>
    );
}

export default Note