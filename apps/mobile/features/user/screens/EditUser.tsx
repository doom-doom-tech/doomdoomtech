import {ActivityIndicator, StyleSheet, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import Header from "@/common/components/header/Header";
import EditUserAvatar from "@/features/user/components/edit-user/EditUserAvatar";
import EditUserBanner from "@/features/user/components/edit-user/EditUserBanner";
import ActionText from "@/common/components/ActionText";
import Scroll from "@/common/components/Scroll";
import {palette, spacing} from "@/theme";
import EditUserBio from "@/features/user/components/edit-user/EditUserBio";
import EditUserSocials from "@/features/user/components/edit-user/EditUserSocials";
import useUserUpdate from "@/features/user/hooks/useUserUpdate";
import EditUserUsername from "@/features/user/components/edit-user/EditUserUsername";
import {useEditUserStoreSelectors} from "@/features/user/store/edit-user";
import Toast from "react-native-root-toast";
import {formatServerErrorResponse, uploadFile, wait} from "@/common/services/utilities";
import {TOASTCONFIG} from "@/common/constants";
import {router} from "expo-router";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";

interface EditUserProps {

}

const EditUser = ({}: EditUserProps) => {

    const user = useGlobalUserContext()

    const values = useEditUserStoreSelectors.values()
    const updateUserMutation = useUserUpdate()

    const [loading, setLoading] = useState<boolean>(false)

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            container: {
                paddingHorizontal: spacing.m,
                paddingBottom: 600,
                gap: spacing.m
            }
        })
    }, []);

    const handleSave = useCallback(async () => {
        try {
            setLoading(true)

            if(!user) return

            const payload = new FormData()

            payload.append('bio', values.bio)
            payload.append('username', values.username)
            payload.append('socials', JSON.stringify(values.socials))

            if(values.avatar) {
                payload.append('avatar_url', await uploadFile(values.avatar, user.getUUID(), 'user.avatar'))
            }

            if(values.banner) {
                payload.append('banner_url', await uploadFile(values.banner, user.getUUID(), 'user.banner'))
            }

            await updateUserMutation.mutateAsync(payload)

            router.back()
            await wait(200)
            Toast.show('Profile updated', TOASTCONFIG.success)
        } catch (error: any) {
            Toast.show(formatServerErrorResponse(error.message), TOASTCONFIG.error)
        } finally {
            setLoading(false)
        }
    }, [values])

    const RightComponent = useCallback(() => loading ? <ActivityIndicator color={palette.olive} /> : (
        <ActionText callback={handleSave} label={"Save"} />
    ), [handleSave])

    return(
        <View style={styles.wrapper}>
            <Header title={"Edit your profile"} RightComponent={RightComponent} />
                <Scroll contentContainerStyle={styles.container} >
                    <EditUserAvatar />
                    <EditUserBanner />
                    <EditUserUsername />
                    <EditUserBio />
                    <EditUserSocials />
                </Scroll>
        </View>
    )
}

export default EditUser