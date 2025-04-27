import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import useUserContext from "@/features/user/hooks/useUserContext";
import UserImageCircle from "@/features/user/components/UserImageCircle";
import FollowButton from "@/features/follow/components/FollowButton";
import {palette, spacing} from "@/theme";
import Text from "@/common/components/Text";


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

    return(
        <View style={styles.wrapper}>
            <UserImageCircle size={110} source={user.getImageSource()} />
            <Text style={styles.username}>
                {user.getUsername()}
            </Text>
            <FollowButton small user={user} />
        </View>
    )
}

export default SuggestedUser