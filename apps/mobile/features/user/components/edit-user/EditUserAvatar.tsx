import {StyleSheet, TouchableOpacity} from 'react-native'
import {useCallback, useMemo} from "react";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import {Image} from "expo-image";
import {useEditUserStoreSelectors} from "@/features/user/store/edit-user";
import User from "@/assets/icons/User";
import {palette, spacing} from "@/theme";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";

interface EditUserAvatarProps {

}

const EditUserAvatar = ({}: EditUserAvatarProps) => {

    const SIZE = 110

    const currentUser = useGlobalUserContext()

    const values = useEditUserStoreSelectors.values()
    const setEditUserState = useEditUserStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                width: SIZE,
                height: SIZE,
                borderRadius: SIZE,
                borderColor: palette.granite,
                paddingHorizontal: spacing.m,
                justifyContent: 'center',
                alignItems: 'center',
                borderStyle: 'dashed',
                borderWidth: 2,
                alignSelf: 'center'
            },
            image: {
                width: SIZE - 4,
                height: SIZE - 4,
                borderRadius: SIZE - 4
            }
        })
    }, []);

    const triggerImagePicker = useCallback(async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if(result.canceled) return Toast.show('Upload cancelled', TOASTCONFIG.warning)

        setEditUserState({
            avatar: result.assets[0]
        })
    }, [])

    if(!currentUser) return null

    if(values.avatar) return (
        <TouchableOpacity style={styles.wrapper} onPress={triggerImagePicker}>
            <Image style={styles.image} source={values.avatar.uri} />
        </TouchableOpacity>
    )

    if(currentUser.getImageSource()) return (
        <TouchableOpacity style={styles.wrapper} onPress={triggerImagePicker}>
            <Image style={styles.image} source={currentUser.getImageSource()} />
        </TouchableOpacity>
    )

    return(
        <TouchableOpacity style={styles.wrapper} onPress={triggerImagePicker}>
            <User />
        </TouchableOpacity>
    )
}

export default EditUserAvatar