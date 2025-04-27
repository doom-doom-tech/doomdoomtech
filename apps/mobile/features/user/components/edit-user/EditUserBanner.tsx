import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native'
import {useCallback, useMemo} from "react";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import {Image} from "expo-image";
import {useEditUserStoreSelectors} from "@/features/user/store/edit-user";
import {palette, spacing} from "@/theme";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import Gallery from "@/assets/icons/Gallery";

interface EditUserAvatarProps {

}

const { width: screenWidth } = Dimensions.get('window')

const EditUserBanner = ({}: EditUserAvatarProps) => {

    const currentUser = useGlobalUserContext()

    const values = useEditUserStoreSelectors.values()
    const setEditUserState = useEditUserStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                width: screenWidth - 32,
                aspectRatio: 16 / 9,
                borderRadius: 4,
                borderColor: palette.granite,
                marginHorizontal: spacing.m,
                justifyContent: 'center',
                alignItems: 'center',
                borderStyle: 'dashed',
                borderWidth: 2,
                alignSelf: 'center'
            },
            image: {
                width: screenWidth - 38,
                aspectRatio: 16 / 9,
            }
        })
    }, []);

    const triggerImagePicker = useCallback(async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });

        if(result.canceled) return Toast.show('Upload cancelled', TOASTCONFIG.warning)

        setEditUserState({
            banner: result.assets[0]
        })
    }, [])

    if(!currentUser) return null

    if(values.banner) return (
        <TouchableOpacity style={styles.wrapper} onPress={triggerImagePicker}>
            <Image style={styles.image} source={values.banner.uri} />
        </TouchableOpacity>
    )

    if(currentUser.getBannerSource()) return (
        <TouchableOpacity style={styles.wrapper} onPress={triggerImagePicker}>
            <Image style={styles.image} source={currentUser.getBannerSource()} />
        </TouchableOpacity>
    )

    return(
        <TouchableOpacity style={styles.wrapper} onPress={triggerImagePicker}>
            <Gallery color={palette.granite} />
        </TouchableOpacity>
    )
}

export default EditUserBanner