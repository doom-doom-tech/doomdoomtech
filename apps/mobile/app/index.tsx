import {Redirect} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {Fragment, useEffect} from "react";
import {LogBox} from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import useExpoUpdates from "@/common/hooks/useExpoUpdates";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

SplashScreen.setOptions({
    duration: 3000,
    fade: false,
});

// Ignore all log notifications
LogBox.ignoreAllLogs(true);

// Suppress warnings
console.warn = () => {};

const APIKeys = {
    apple: process.env['EXPO_PUBLIC_REVENUECAT_IOS'],
    google: process.env['EXPO_PUBLIC_REVENUECAT_ANDROID'],
};

export default function Index() {

    const { checkForUpdates } = useExpoUpdates();

    useEffect(() => {
        checkForUpdates();
    }, []);

    return (
        <Fragment>
            <StatusBar style={'light'} />
            <Redirect href={'/feed'} />
        </Fragment>
    )
}