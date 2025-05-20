import {Alert, DeviceEventEmitter, StyleSheet} from 'react-native'
import {useCallback, useMemo} from "react";
import Screen from "@/common/components/Screen";
import Header from "@/common/components/header/Header";
import Scroll from "@/common/components/Scroll";
import NavigationTabGroup from "@/features/settings/components/NavigationTabGroup";
import NavigationTab from "@/features/settings/components/NavigationTab";
import {Href, router} from "expo-router";
import {useAuthStoreSelectors} from "@/features/auth/store/auth";
import {spacing} from "@/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {wait} from "@/common/services/utilities";
import _ from 'lodash';
import {usePaymentContext} from "@/common/context/PaymentContextProvider";

interface SettingsOverviewProps {

}

const SettingsOverview = ({}: SettingsOverviewProps) => {

    const setAuthState = useAuthStoreSelectors.setState()

    const { premiumMember } = usePaymentContext()

    const { logOutFromRevenueCat } = usePaymentContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            container: {
                gap: spacing.l,
                paddingBottom: 200
            }
        })
    }, []);

    const handleEditProfile = useCallback(() => {
        router.push('/edit-user')
    }, [])

    const handleRouteBlockedUsers = useCallback(() => {
        router.push('/settings/blocked')
    }, [])

    const handleRouteBugReport = useCallback(() => {
        router.push('/settings/report-bug')
    }, [])

    const handleRouteManageSubscription = useCallback(() => {
        router.push('/settings/subscription/manage')
    }, [])

    const handleDeleteProfile = useCallback(() => {
        router.push('/delete-account')
    }, [])

    const handleInternalLink = useCallback((route: Href) => () => {
        router.push(route)
    }, [])

    const handleLogout = useCallback(async () => {
        Alert.alert("Logout", "Are you sure you want to log out?", [
            {
                text: 'Cancel',
                onPress: _.noop,
                style: 'cancel',
            },
            {
                text: "Log out",
                style: 'destructive',
                onPress: async () => {
                    await AsyncStorage.removeItem('Auth.accessToken')
                    setAuthState({ authorized: false })

                    await wait(200)

                    await logOutFromRevenueCat()

                    DeviceEventEmitter.emit('user:invalidate')
                    router.push('/feed')
                }
            }
        ])
    }, [])

    const handleTriggerInviteSheet = useCallback(() => {
        DeviceEventEmitter.emit('sheet:expand', { name: 'InviteCode' })
    }, [])

    return(
        <Screen>
            <Header title={"Settings"} />
            <Scroll contentContainerStyle={styles.container}>
                <NavigationTabGroup title={"Account"}>
                    <NavigationTab
                        icon={"None"}
                        subtitle={"Update your avatar, bio and socials"}
                        title={"Edit profile"}
                        callback={handleEditProfile}
                    />

                    { premiumMember && (
                        <NavigationTab
                            icon={"None"}
                            subtitle={"View your current plan"}
                            title={"Manage subscription"}
                            callback={handleRouteManageSubscription}
                        />
                    )}

                    <NavigationTab
                        icon={"None"}
                        subtitle={"Manage all users you blocked"}
                        title={"Blocked users"}
                        callback={handleRouteBlockedUsers}
                    />

                    <NavigationTab
                        icon={"None"}
                        subtitle={"Invite your friends and earn credits"}
                        title={"Invite users"}
                        callback={handleTriggerInviteSheet}
                    />

                    <NavigationTab
                        subtitle={""}
                        icon={"Internal"}
                        title={"Delete my account"}
                        callback={handleDeleteProfile}
                    />
                </NavigationTabGroup>
                <NavigationTabGroup title={"Support"}>
                    <NavigationTab
                        icon={"Outbound"}
                        subtitle={""}
                        title={"Privacy Policy"}
                        callback={handleInternalLink('/privacy-policy')}
                    />

                    <NavigationTab
                        icon={"Outbound"}
                        subtitle={""}
                        title={"Terms of Service"}
                        callback={handleInternalLink('/terms-of-service')}
                    />

                    <NavigationTab
                        subtitle={""}
                        icon={"None"}
                        title={"Log out"}
                        callback={handleLogout}
                    />
                </NavigationTabGroup>
            </Scroll>
        </Screen>
    )
}

export default SettingsOverview