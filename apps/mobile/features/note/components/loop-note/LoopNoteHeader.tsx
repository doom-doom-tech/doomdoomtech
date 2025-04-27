import {StyleSheet, View} from 'react-native'
import {Fragment, useMemo} from "react";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import UserContextProvider from "@/features/user/context/UserContextProvider";
import UserRow from "@/features/user/components/user-row/UserRow";
import _ from 'lodash';
import Loop from "@/assets/icons/Loop";
import {Image} from "expo-image";
import {useNoteContext} from "@/features/note/context/NoteContextProvider";
import {palette, spacing} from "@/theme";
import Text from "@/common/components/Text";

interface LoopNoteHeaderProps {

}

const LoopNoteHeader = ({}: LoopNoteHeaderProps) => {

    const note = useNoteContext()
    const user = useGlobalUserContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.s,
            },
            image: {
                width: 24, height: 24,
                borderRadius: 24
            },
            looped: {
                paddingHorizontal: spacing.xl,
                gap: spacing.s,
                flexDirection: 'row',
                alignItems: 'center'
            },
            username: {
                color: palette.offwhite
            }
        })
    }, []);

    if(!user) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <UserContextProvider user={user}>
                <UserRow type={'no-action'} callback={_.noop} />
            </UserContextProvider>
            <View style={styles.looped}>
                <Loop />
                <Image
                    style={styles.image}
                    source={note.getUser().getImageSource()}
                />
                <Text style={styles.username}>
                    {note.getUser().getUsername()}
                </Text>
            </View>
        </View>
    )
}

export default LoopNoteHeader