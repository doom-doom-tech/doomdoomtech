import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import useSingleUserContext from "@/features/user/hooks/useSingleUserContext";
import SocialPlatformIcon from "@/common/components/SocialPlatformIcon";
import _ from 'lodash';
import {SocialPlatformInterface} from "@/features/user/types";
import {spacing} from "@/theme";

interface UserSocialsProps {

}

const UserSocials = ({}: UserSocialsProps) => {

    const user = useSingleUserContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                alignSelf: 'center',
                flexDirection: 'row',
                gap: spacing.m
            },
        })
    }, []);

    const handleOpenSocial = useCallback((platform: SocialPlatformInterface) => async () => {
        await Linking.openURL(platform.url)
    }, [])

    if(!user.getSocials().length) return <Fragment />


    return(
        <View style={styles.wrapper}>
            { _.map(user.getSocials(), platform => (
                <TouchableOpacity onPress={handleOpenSocial(platform)}>
                    <SocialPlatformIcon type={platform.type} />
                </TouchableOpacity>
            ))}
        </View>
    )
}

export default UserSocials