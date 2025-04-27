import {DeviceEventEmitter, StyleSheet, Text, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Header from "@/common/components/header/Header";
import {styling} from "@/theme";
import Verified from "@/assets/icons/Verified";
import useSingleUserContext from "@/features/user/hooks/useSingleUserContext";
import {useActionSheet} from "@expo/react-native-action-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";
import {useAuthStoreSelectors} from "@/features/auth/store/auth";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import {wait} from "@/common/services/utilities";
import SettingsIcon from "@/common/components/SettingsIcon";

interface UserHeaderProps {

}

const UserHeader = ({}: UserHeaderProps) => {

    const user = useSingleUserContext()
    const currentUser = useGlobalUserContext()

    const setAuthState = useAuthStoreSelectors.setState()

    const { showActionSheetWithOptions } = useActionSheet()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const handleLogout = useCallback(async () => {
        await AsyncStorage.removeItem('Auth.accessToken')
        setAuthState({ authorized: false })

        await wait(200)

        DeviceEventEmitter.emit('user:invalidate')
        router.push('/feed')
    }, [])

    const isCurrentUser = useMemo(() => {
        return user.getID() === currentUser?.getID()
    }, [])

    const headerActions = useMemo(() => {
        return isCurrentUser ? ['Logout', 'Cancel'] : ['Report', 'Cancel']
    }, [isCurrentUser])

    const handleActionSheetCallbacks = useCallback(async (index: number | undefined) => {
        switch (headerActions[index as number]) {
            case 'Logout': await handleLogout(); break
            default: return
        }
    }, [headerActions])

    const handleExpandOptionSheet = useCallback(() => {
        showActionSheetWithOptions({
            options: headerActions,
            cancelButtonIndex: 2,
            destructiveButtonIndex: 1,
        }, handleActionSheetCallbacks)
    }, [handleActionSheetCallbacks])

    const TitleComponent = useCallback(() => (
        <View style={styling.row.s}>
            <Text style={styling.text.header}>
                {user.getUsername()}
            </Text>
            { user.verified() && <Verified /> }
        </View>
    ), [user])

    const RightComponent = useCallback(() => (
        <View style={styling.row.s}>
            { isCurrentUser && <SettingsIcon /> }
        </View>
    ), [handleExpandOptionSheet])

    return(
        <Header TitleComponent={TitleComponent} RightComponent={RightComponent} />
    )
}

export default UserHeader