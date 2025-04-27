import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import useSingleUserContext from "@/features/user/hooks/useSingleUserContext";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import FollowButton from "@/features/follow/components/FollowButton";
import IconButton from "@/common/components/buttons/IconButton";
import {palette, spacing} from "@/theme";
import CreditFunds from "@/features/credits/components/CreditFunds";
import Hashtag from "@/assets/icons/Hashtag";
import Bell from "@/assets/icons/Bell";
import {router} from "expo-router";
import {usePaymentContext} from "@/common/context/PaymentContextProvider";
import Eye from "@/assets/icons/Eye";

interface UserActionsProps {

}

const UserActions = ({}: UserActionsProps) => {

    const user = useSingleUserContext()
    const currentUser = useGlobalUserContext()

    const {premiumMember} = usePaymentContext()

    const isCurrentUser = useMemo(() => {
        return currentUser && user.getID() === currentUser.getID()
    }, [user, currentUser])

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
                flexDirection: 'row',
                paddingHorizontal: spacing.m,
                justifyContent: 'space-between',
            },
            right: {
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.s,
            }
        })
    }, []);

    const InitialActions = useMemo(() => {
        if(isCurrentUser) return <CreditFunds amount={currentUser?.getCreditValue() ?? 0} />
        return <FollowButton user={user} />
    }, [isCurrentUser, user, currentUser])

    const routeLabelInbox = useCallback(() => {
        router.push(`/label/${user.getUsername()}/inbox`)
    }, [])

    const handleRouteProfileVisits = useCallback(() => {
        router.push(`/user/${user.getID()}/visits`)
    }, [])

    const routeAlerts = useCallback(() => {
        router.push(`/alerts`)
    }, [])

    return(
        <View style={styles.wrapper}>
            {InitialActions}

            <View style={styles.right}>
                { isCurrentUser && (
                    <IconButton
                        premium
                        icon={<Eye color={palette.offwhite} />}
                        fill={'darkgrey'}
                        callback={handleRouteProfileVisits}
                    />
                )}

                { user.isLabel() && isCurrentUser && <IconButton
		            icon={<Hashtag color={palette.offwhite} />}
		            fill={'darkgrey'}
		            callback={routeLabelInbox}
	            />}

                { isCurrentUser && <IconButton
		            icon={<Bell color={palette.offwhite} />}
		            fill={'darkgrey'}
		            callback={routeAlerts}
	            />}
            </View>
        </View>
    )
}

export default UserActions