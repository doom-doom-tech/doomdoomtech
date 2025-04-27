import {DeviceEventEmitter, useWindowDimensions} from 'react-native'
import {useEffect, useState} from "react";
import {palette, spacing} from "@/theme";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import LoginForm from "@/features/auth/components/LoginForm";
import RegisterForm from "@/features/auth/components/RegisterForm";
import useEventListener from "@/common/hooks/useEventListener";
import {useLocalSearchParams} from "expo-router";

interface AuthenticateContentProps {

}

const AuthenticateContent = ({}: AuthenticateContentProps) => {

    const { width } = useWindowDimensions()

    const { code } = useLocalSearchParams()

    const [index, setIndex] = useState(0)

    const [routes] = useState([
        { key: 'login', title: 'Login' },
        { key: 'register', title: 'Register' },
    ])

    const renderScene = SceneMap({
        login: LoginForm,
        register: RegisterForm,
    })

    useEffect(() => {
        if (code) {
            const timeout = setTimeout(() => {
                setIndex(1)
                DeviceEventEmitter.emit('form:update', { code })
            }, 500) // Wait for TabView to mount fully

            return () => clearTimeout(timeout)
        }
    }, [code])

    useEventListener('auth:index:login', () => setIndex(0))
    useEventListener('auth:index:register', () => setIndex(1))

    return(
        <TabView
            onIndexChange={setIndex}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={(props) => (
                <TabBar
                    {...props}
                    indicatorStyle={{ backgroundColor: palette.transparent, height: 46, margin: 4, width: width / 2, borderBottomWidth: 2, borderColor: palette.rose}}
                    style={{ backgroundColor: palette.transparent, borderRadius: 50, marginBottom: spacing.m, justifyContent: 'center', height: 56, elevation: 0 }}
                    activeColor={palette.offwhite}
                    inactiveColor={palette.offwhite + '80'}
                />
            )}
        />
    )
}

export default AuthenticateContent