import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import User from "@/features/user/classes/User";
import UserRow from "@/features/user/components/user-row/UserRow";
import UserContextProvider from "@/features/user/context/UserContextProvider";
import {router} from "expo-router";

interface SingleNoteHeaderProps {

}

const SingleNoteHeader = ({}: SingleNoteHeaderProps) => {

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

    return(
        <View style={styles.wrapper}>
            <UserContextProvider user={user}>
                <UserRow type={'follow'} callback={handleRouteUser} />
            </UserContextProvider>
        </View>
    )
}

export default SingleNoteHeader