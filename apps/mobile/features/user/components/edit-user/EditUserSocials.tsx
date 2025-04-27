import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Input from "@/common/components/inputs/Input";
import {SocialPlatformInterface} from "@/features/user/types";
import _ from 'lodash';
import {spacing} from "@/theme";
import {useEditUserStoreSelectors} from "@/features/user/store/edit-user";
import SocialPlatformIcon from "@/common/components/SocialPlatformIcon";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";

interface EditUserSocialsProps {

}



const socialPlatforms = ["Tiktok" , "Website" , "Twitter" , "Snapchat" , "Facebook" , "Instagram" , "Soundcloud" , "Spotify"] as const

const EditUserSocials = ({}: EditUserSocialsProps) => {

    const currentUser = useGlobalUserContext()

    const { socials } = useEditUserStoreSelectors.values()
    const setEditUserState = useEditUserStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.s
            },
            item: {
                gap: spacing.s,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
            },
            input: {
                flex: 1
            }
        })
    }, []);

    const handleChange = useCallback((platform: typeof socialPlatforms[number]) => (value: string) => {
        if(_.some(socials, social => social.type === platform)) {
            socials[_.findIndex(socials, social => social.type === platform)] = {
                type: platform,
                url: value
            }
            return setEditUserState({ socials: socials })
        }

        setEditUserState({ socials: [...socials, { type: platform, url: value }] })
    }, [setEditUserState, socials])

    const getEditedValue = useCallback((platform: typeof socialPlatforms[number]) => {
        const editedSocial = _.find(socials, s => s.type === platform);
        if (editedSocial) {
            return editedSocial.url;
        }
        const currentSocial = _.find(currentUser!.getSocials(), s => s.type === platform);
        return currentSocial ? currentSocial.url : '';
    }, [socials, currentUser]);

    const defaultValue = useCallback((platform: typeof socialPlatforms[number]) => {
        return _.get(_.find(currentUser!.getSocials(), social => social.type === platform), 'url', '')
    }, [socials])

    const RenderItem = useCallback(({ platform }: { platform: SocialPlatformInterface['type'] }) => (
        <View style={styles.item}>
            <SocialPlatformIcon type={platform} />
            <Input value={getEditedValue(platform)} wrapperStyle={styles.input} onChangeText={handleChange(platform)} />
        </View>
    ), [defaultValue, socials, getEditedValue])

    return(
        <View style={styles.wrapper}>
            { _.map(socialPlatforms, platform => (
                <RenderItem platform={platform} />
            ))}
        </View>
    )
}

export default EditUserSocials