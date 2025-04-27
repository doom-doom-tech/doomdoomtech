import UserRow, {UserRowProps} from "@/features/user/components/user-row/UserRow";
import UserContextProvider from "@/features/user/context/UserContextProvider";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import User from "@/features/user/classes/User";
import {StyleSheet, View} from "react-native";
import {useMemo} from "react";
import {spacing} from "@/theme";

interface NoteHeaderProps extends UserRowProps {
    user: User
}

const NoteHeader = ({user, ...rest}: NoteHeaderProps) => {

    const note = useNoteContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingHorizontal: spacing.m,
            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <UserContextProvider user={user ?? note.getUser()}>
                <UserRow {...rest} />
            </UserContextProvider>
        </View>
    )
}

export default NoteHeader