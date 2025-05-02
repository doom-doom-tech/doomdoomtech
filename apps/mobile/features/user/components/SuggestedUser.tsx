import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo} from "react";
import useUserContext from "@/features/user/hooks/useUserContext";
import UserImageCircle from "@/features/user/components/UserImageCircle";
import FollowButton from "@/features/follow/components/FollowButton";
import {palette, spacing} from "@/theme";
import Text from "@/common/components/Text";
import {router} from "expo-router";


interface SuggestedUserProps {

}

const SuggestedUser = ({}: SuggestedUserProps) => {

    const user = useUserContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.s,
                padding: spacing.m,
                borderRadius: 4,
                backgroundColor: palette.darkgrey + '60'
            },
            username: {
                textAlign: 'center',
                fontWeight: 'bold',
                color: palette.offwhite
            }
        })
    }, []);

    const handleRouteUser = useCallback(() => {
        router.push(`/user/${user.getID()}`)
    }, [user])

    return(
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={handleRouteUser}>
                <UserImageCircle size={110} source={user.getImageSource()} />
            </TouchableOpacity>

            <Text style={styles.username} onPress={handleRouteUser}>
                {user.getUsername()}
            </Text>
            <FollowButton small user={user} />
        </View>
    )
}

export default SuggestedUser