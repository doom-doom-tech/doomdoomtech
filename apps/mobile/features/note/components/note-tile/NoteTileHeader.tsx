import {StyleSheet, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import NoteHeader from "@/features/note/components/NoteHeader";
import User from "@/features/user/classes/User";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import {router} from "expo-router";
import NoteLoopUserCircle from "@/features/note/components/NoteLoopUserCircle";

interface NoteTileHeaderProps {

}

const NoteTileHeader = ({}: NoteTileHeaderProps) => {

    const note = useNoteContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const user = useMemo(() => {
        return note.looped() ? note.getLooper() as User : note.getUser()
    }, [note])

    const handleRouteUser = useCallback(() => {
        router.push(`/user/${user.getID()}`)
    }, [user])

    const ContentRight = useCallback(() => {
        return note.looped() ? <NoteLoopUserCircle /> : <Fragment />
    }, [note])

    return(
        <View style={styles.wrapper}>
            <NoteHeader user={user} callback={handleRouteUser} type={'custom'} ContentRight={ContentRight} />
        </View>
    )
}

export default NoteTileHeader