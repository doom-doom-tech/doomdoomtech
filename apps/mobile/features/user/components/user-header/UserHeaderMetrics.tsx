import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo} from "react";
import useSingleUserContext from "@/features/user/hooks/useSingleUserContext";
import millify from "millify";
import {palette, spacing} from "@/theme";
import {router} from "expo-router";
import {pluralOrSingular} from "@/common/services/utilities";

interface UserHeaderMetricsProps {

}

const UserHeaderMetrics = ({}: UserHeaderMetricsProps) => {

    const user = useSingleUserContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                alignSelf: 'center',
                flexDirection: 'row',
                gap: spacing.m
            },
            amount: {
                textAlign: 'center',
                color: palette.offwhite,
                fontWeight: 800
            },
            label: {
                textAlign: 'center',
                color: palette.granite
            }
        })
    }, []);

    const triggerFollowersSheet = useCallback(async () => {
        router.push(`/followers/${user.getID()}`)
    }, [user])

    const triggerFollowingSheet = useCallback(async () => {
        router.push(`/following/${user.getID()}`)
    }, [user])

    return(
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={triggerFollowersSheet}>
                <Text style={styles.amount}>
                    {millify(user.getFollowersAmount() ?? 0)}
                </Text>
                <Text style={styles.label}>
                    {pluralOrSingular(user.getFollowersAmount() ?? 0, 'Follower')}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={triggerFollowingSheet}>
                <Text style={styles.amount}>
                    {millify(user.getFollowingAmount() ?? 0)}
                </Text>
                <Text style={styles.label}>
                    Following
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default UserHeaderMetrics