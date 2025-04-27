import {StyleSheet, View} from 'react-native'
import {Fragment, useMemo} from "react";
import Text from "@/common/components/Text";
import useSingleUserContext from "@/features/user/hooks/useSingleUserContext";
import {palette, spacing} from "@/theme";

interface UserBiographyProps {

}

const UserBiography = ({}: UserBiographyProps) => {

    const user = useSingleUserContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingHorizontal: spacing.m
            },
            text: {
                textAlign: 'center',
                fontSize: 16,
                color: palette.offwhite
            }
        })
    }, []);

    if(!user.getBio()) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <Text style={styles.text}>
                {user.getBio()}
            </Text>
        </View>
    )
}

export default UserBiography