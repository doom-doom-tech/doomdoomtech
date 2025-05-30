import {Redirect} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {Fragment, useEffect} from "react";
import {LogBox} from "react-native";
import useExpoUpdates from "@/common/hooks/useExpoUpdates";
import * as Notifications from 'expo-notifications';
import { useSocketContext } from "@/common/context/SocketContextProvider";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

// Ignore all log notifications
LogBox.ignoreAllLogs(true);

// Suppress warnings
console.warn = () => {};

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