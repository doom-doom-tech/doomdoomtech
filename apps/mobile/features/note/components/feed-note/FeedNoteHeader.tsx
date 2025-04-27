import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import User from "@/features/user/classes/User";
import UserContextProvider from "@/features/user/context/UserContextProvider";
import UserRow from "@/features/user/components/user-row/UserRow";
import {router} from "expo-router";
import {spacing} from "@/theme";

const FeedNoteHeader = () => {

    const note = useNoteContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingHorizontal: spacing.m
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

export default FeedNoteHeader