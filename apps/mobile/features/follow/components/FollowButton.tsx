import {DeviceEventEmitter, StyleSheet, View} from 'react-native'
import {Fragment, useCallback, useMemo, useState} from "react";
import Button from '@/common/components/buttons/Button';
import User from "@/features/user/classes/User";
import SingleUser from "@/features/user/classes/SingleUser";
import useFollow from "@/features/follow/hooks/useFollow";
import useUnfollow from "@/features/follow/hooks/useUnfollow";
import useEventListener from "@/common/hooks/useEventListener";
import {UserIDRequest} from "@/features/user/types/requests";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import {router} from "expo-router";

interface FollowButtonProps {
    small?: boolean
    user: User | SingleUser
}

const FollowButton = ({small, user}: FollowButtonProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                width: '100%',
                transform: [{ scale: small ? 0.8 : 1 }]
            },
        })
    }, [small]);

    const currentUser = useGlobalUserContext()

    const followMutation = useFollow()
    const unfollowMutation = useUnfollow()

    const [following, setFollowing] = useState<boolean>(
        currentUser ? user.following() : false
    )

    const manageFollow = useCallback(async () => {
        try {
            if(!currentUser) return router.push('/auth')

            if(currentUser?.getID() === user.getID()) return Toast
                .show('You cannot follow yourself', TOASTCONFIG.warning)

            following
                ? unfollowMutation.mutate({ userID: user.getID() })
                : followMutation.mutate({ userID: user.getID() })

            following
                ? DeviceEventEmitter.emit('user:unfollow', { userID: user.getID() })
                : DeviceEventEmitter.emit('user:follow', { userID: user.getID() })
        } catch (error: any) {

        }
    }, [following, currentUser])

    const catchFollowEvent = useCallback((event: UserIDRequest) => {
        if (event.userID === user.getID()) {
            setFollowing(true);
        }
    }, [user]);

    const catchUnfollowEvent = useCallback((event: UserIDRequest) => {
        if (event.userID === user.getID()) {
            setFollowing(false);
        }
    }, [user]);

    useEventListener('user:follow', catchFollowEvent)
    useEventListener('user:unfollow', catchUnfollowEvent)

    if(currentUser?.getID() === user.getID()) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <Button
                fullWidth
                color={following ? "black" : "offwhite"}
                fill={following ? "olive" : "transparent"}
                border={following ? "olive" : "granite"}
                callback={manageFollow}
                label={following ? "Following" : "Follow"} />
        </View>

    )
}

export default FollowButton