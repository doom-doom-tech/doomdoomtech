import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import useSingleUserContext from "@/features/user/hooks/useSingleUserContext";
import Brush from "@/assets/icons/Brush";
import {palette} from "@/theme";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import {router} from "expo-router";
import {useEditUserStoreSelectors} from "@/features/user/store/edit-user";
import Hashtag from "@/assets/icons/Hashtag";
import UserImageCircle from "@/features/user/components/UserImageCircle";

interface UserHeaderContentProps {

}

const UserHeaderContent = ({}: UserHeaderContentProps) => {

    const user = useSingleUserContext()
    const currentUser = useGlobalUserContext()

    const setEditUserState = useEditUserStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                alignSelf: 'center',
                position: 'relative',
            },
            avatar: {
                width: 120,
                height: 120,
                borderRadius: 120,
            },
            edit: {
                padding: 4,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 120,
                position: 'absolute',
                backgroundColor: palette.darkgrey,
                bottom: 0,
                right: 0
            },
            labelCircle: {
                padding: 4,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 120,
                position: 'absolute',
                backgroundColor: palette.olive,
                bottom: 0,
                right: 0
            },
            brush: {
                width: 16,
                height: 16,
                color: palette.black
            }
        })
    }, []);

    const handleEditUser = useCallback(() => {
        if(!currentUser) return
        if(user.getID() !== currentUser.getID()) return

        setEditUserState({
            username: user.getUsername(),
            bio: user.getBio(),
            socials: user.getSocials(),
        })
        router.push('/edit-user')
    }, [user, currentUser])

    const EditComponent = useCallback(() => {
        if(user.isLabel()) return  (
            <TouchableOpacity activeOpacity={0.5} style={styles.labelCircle} onPress={handleEditUser}>
                <Hashtag color={palette.offwhite} />
            </TouchableOpacity>
        )

        if(currentUser?.getID() !== user.getID()) return <Fragment />

        return (
            <TouchableOpacity activeOpacity={0.5} style={styles.edit} onPress={handleEditUser}>
                <Brush style={styles.brush} color={palette.black} />
            </TouchableOpacity>
        )
    }, [user, currentUser, handleEditUser])

    return(
        <View style={styles.wrapper}>
            <UserImageCircle size={110} source={user.getImageSource()} />
            <EditComponent />
        </View>
    )
}

export default UserHeaderContent