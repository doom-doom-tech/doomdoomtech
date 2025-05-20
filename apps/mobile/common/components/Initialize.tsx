import {Fragment, useCallback, useEffect, useRef} from "react";
import {useFonts} from "expo-font";
import * as Device from "expo-device"
import useRegisterDevice from "@/features/device/hooks/useRegisterDevice";
import * as Notifications from "expo-notifications";
import {Platform} from "react-native";
import {router} from "expo-router";
import TrackPlayer, {Capability, RatingType} from "react-native-track-player"
import MediaService from "@/common/services/media";
import useSessionRequest from "@/common/hooks/useSessionRequest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {STORAGE_KEYS} from "@/common/services/api";
import useMediaEvents from "@/common/hooks/useMediaEvents";
import * as SplashScreen from 'expo-splash-screen';
import useSubscriptionValidate from "@/features/subscription/hooks/useSubscriptionValidate";
import _ from "lodash";
import {Syne_400Regular, Syne_500Medium, Syne_700Bold, Syne_800ExtraBold} from "@expo-google-fonts/syne";

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

const Initialize = () => {

    useMediaEvents()

    const [fontsLoaded] = useFonts({
        Syne: require('@/assets/fonts/SYNE.ttf'),
        SyneExtraBold: Syne_800ExtraBold,
        SyneRegular: Syne_400Regular,
        SyneMedium: Syne_500Medium,
        SyneBold: Syne_700Bold,
    });

    const responseListener = useRef<Notifications.EventSubscription>()

    const registerDeviceMutation = useRegisterDevice()
    const requestFreshSessionMutation = useSessionRequest()

    const validateSubscriptionMutation = useSubscriptionValidate()

    const initializeTrackPlayer = useCallback(async () => {

        TrackPlayer.registerPlaybackService(() => MediaService);

        await TrackPlayer.setupPlayer({ autoUpdateMetadata: true, autoHandleInterruptions: true});

        await TrackPlayer.updateOptions({
            ratingType: RatingType.FiveStars,
            progressUpdateEventInterval: 1,
            compactCapabilities: [
                Capability.Play,
                Capability.Pause,
            ],
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.SeekTo,
                Capability.Stop,
                Capability.SetRating
            ],
            notificationCapabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.SeekTo,
                Capability.Stop,
                Capability.SetRating
            ],
        });
    }, [])

    const registerUserDevice = useCallback(async () => {
        if(Device.isDevice) {
            const {status: existingStatus} = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const {status} = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                return;
            }

            const pushTokenResponse = await Notifications.getExpoPushTokenAsync({
                projectId: "fdd82ade-643f-4899-8a37-1e9821d4900c",
            });

            const deviceTokenString = (await Notifications.getDevicePushTokenAsync()).data;
            const pushTokenString = pushTokenResponse.data;

            await registerDeviceMutation.mutateAsync({
                platform: Platform.OS,
                push_token: pushTokenString,
                device_token: deviceTokenString,
                expo_device_id: `${Device.deviceName}-${Device.modelName}`
            })
        }
    }, [])

    const requestFreshSession = useCallback(async () => {
        if(!await AsyncStorage.getItem(STORAGE_KEYS.AUTH)) return
        await requestFreshSessionMutation.mutateAsync()
    }, [])

    const validateSubscriptionState = useCallback(async () => {
        if(!await AsyncStorage.getItem(STORAGE_KEYS.AUTH)) return

        await validateSubscriptionMutation.mutateAsync()
    }, [])

    useEffect(() => {
        const initialize = async () => {
            if (fontsLoaded) {
                await registerUserDevice()
                await initializeTrackPlayer()
                await requestFreshSession()
                await validateSubscriptionState()

                // Hide the splash screen once fonts are loaded and initialization is complete
                await SplashScreen.hideAsync()
            }
        }

        SplashScreen.hideAsync()

        initialize().then()
    }, [fontsLoaded]);

    useEffect(() => {
        responseListener.current = Notifications.addNotificationResponseReceivedListener(({notification}) => {
            const deeplink = _.get(notification, 'request.content.data.data.url', undefined)
            if(deeplink) router.push(deeplink)
        });

        return () => {
            responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    // Only render the app content when fonts are loaded
    if (!fontsLoaded) {
        return null;
    }

    return <Fragment />
}

export default Initialize
