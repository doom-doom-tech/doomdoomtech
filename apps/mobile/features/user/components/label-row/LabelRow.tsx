import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Fragment, ReactElement, useCallback, useMemo} from "react";
import {palette, spacing, styling} from "@/theme";
import Radio from "@/assets/icons/Radio";
import RadioSelected from "@/assets/icons/RadioSelected";
import Hashtag from "@/assets/icons/Hashtag";
import {useLabelContext} from "@/features/label/context/LabelContextProvider";
import {router} from "expo-router";
import FollowButton from "@/features/follow/components/FollowButton";
import User from "@/features/user/classes/User";
import UserImageCircle from "@/features/user/components/UserImageCircle";
import UserContextProvider from "@/features/user/context/UserContextProvider";

interface UserRowProps {
    selected?: boolean
    selectable?: boolean
    callback?: (...args: Array<any>) => unknown
    type: 'follow' | 'no-action' | 'custom'
    ContentRight?: (...args: Array<any>) => ReactElement
}

const LabelRow = ({selected, selectable, callback, type, ContentRight}: UserRowProps) => {

    const label = useLabelContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: spacing.m
            },
            content: {
                gap: spacing.s,
                flexDirection: 'row',
                alignItems: 'center'
            },
            usernameBox: {
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
            },
            username: {
                color: palette.offwhite,
                fontSize: 16,
                fontWeight: 700,
            },
            badge: {
                width: 16,
                height: 16,
                marginLeft: 4,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                backgroundColor: palette.olive,
            }
        })
    }, []);

    const ActionComponent = useMemo(() => {
        switch (type) {
            case "follow": return (
                <FollowButton user={label as unknown as User} />
            )

            case "no-action": return (
                <Fragment />
            )

            case "custom": return (
                ContentRight ? <ContentRight /> : <Fragment />
            )
        }
    }, [type, ContentRight, label])

    const handlePress = useCallback(() => {
        if(!selectable && !callback) return router.push(`/user/${label.getID()}`)
        if(callback) callback()
    }, [selectable, callback])

    return(
        <View style={styles.wrapper}>
            <UserContextProvider user={label as unknown as User}>
                <TouchableOpacity style={styling.row.m} activeOpacity={0.5} onPress={handlePress}>
                    { selectable && (
                        <Fragment>
                            {selected ? <RadioSelected color={palette.olive} /> : <Radio />}
                        </Fragment>
                    )}

                    <UserImageCircle
                        size={50}
                        source={label.getImageSource()}
                    />

                    <View style={styles.content}>

                        <View style={styles.usernameBox}>
                            <Text style={styles.username}>
                                { label.getUsername().toLowerCase() }
                            </Text>
                            <View style={styles.badge}>
                                <Hashtag width={12} height={12} color={palette.offwhite}/>
                            </View>
                        </View>

                    </View>
                </TouchableOpacity>
                <View>
                    {ActionComponent}
                </View>
            </UserContextProvider>
        </View>
    )
}

export default LabelRow