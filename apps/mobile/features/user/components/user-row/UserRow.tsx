import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Fragment, ReactElement, useCallback, useMemo} from "react";
import UserCircle from "@/features/user/components/UserCircle";
import {palette, spacing, styling} from "@/theme";
import FollowButton from "@/features/follow/components/FollowButton";
import Radio from "@/assets/icons/Radio";
import RadioSelected from "@/assets/icons/RadioSelected";
import useUserContext from "@/features/user/hooks/useUserContext";
import {pluralOrSingular} from "@/common/services/utilities";
import {router} from "expo-router";
import Text from "@/common/components/Text";
import LabelBadge from "@/common/components/LabelBadge";

export interface UserRowProps {
    selected?: boolean
    selectable?: boolean
    subtitle?: string
    type: 'follow' | 'no-action' | 'custom'
    callback?: (...args: Array<any>) => unknown
    ContentRight?: (...args: Array<any>) => ReactElement
}

const UserRow = ({type, ContentRight, subtitle, selectable, selected, callback}: UserRowProps) => {

    const user = useUserContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: spacing.m
            },
            information: {

            },
            username: {
                color: palette.offwhite,
                fontWeight: 700,
            },
            subtitle: {
                color: palette.offwhite,
                fontWeight: 700,
                opacity: 0.5
            }
        })
    }, []);

    const ActionComponent = useMemo(() => {
        switch (type) {
            case "follow": return (
                <FollowButton user={user} />
            )

            case "no-action": return (
                <Fragment />
            )

            case "custom": return (
                ContentRight ? <ContentRight /> : <Fragment />
            )
        }
    }, [type, ContentRight, user])

    const handleRouteUser = useCallback(() => {
        router.push(`/user/${user.getID()}`)
    }, [user])

    const subtitleContent = useMemo(() => {
        if(subtitle) return subtitle
        return user.getTracksCount() + ' ' + pluralOrSingular(user.getTracksCount(), 'track')
    }, [subtitle, user])

    return(
        <View style={styles.wrapper}>
            <TouchableOpacity style={styling.row.m} activeOpacity={0.5} onPress={callback ?? handleRouteUser}>
                {selectable && (
                    <Fragment>
                        {selected ? <RadioSelected color={palette.olive} /> : <Radio />}
                    </Fragment>
                )}
                <UserCircle source={user.getImageSource()} size={50} />
                <View style={styles.information}>
                    {user.isLabel() ? (
                        <View style={styling.row.xs}>
                            <Text style={styles.username}>
                                { user.getUsername() }
                            </Text>
                            <LabelBadge size={16} />
                        </View>
                    ) : (
                        <Text style={styles.username}>
                            { user.getUsername() }
                        </Text>
                    )}
                    <Text style={styles.subtitle}>
                        { subtitleContent }
                    </Text>
                </View>
            </TouchableOpacity>
            <View>
                {ActionComponent}
            </View>
        </View>
    )
}

export default UserRow
