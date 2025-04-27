import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import Text from "@/common/components/Text";
import useUserContext from "@/features/user/hooks/useUserContext";
import Verified from "@/assets/icons/Verified";
import {palette} from "@/theme";

const UserTileName = () => {

    const user = useUserContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: 4,
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center'
            },
            username: {
                color: palette.offwhite
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <Text style={styles.username}>
                {user.getUsername()}
            </Text>
            {user.verified() && <Verified />}
        </View>
    )
}

export default UserTileName