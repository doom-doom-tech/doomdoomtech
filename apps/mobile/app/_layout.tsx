import {Stack} from "expo-router";
import {NativeStackNavigationOptions} from "@react-navigation/native-stack";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useCallback} from "react";
import {palette} from "@/theme";
import {TODO} from "@/common/types/common";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {ActionSheetProvider} from "@expo/react-native-action-sheet";
import {RootSiblingParent} from "react-native-root-siblings";
import Globals from "@/common/components/Globals";
import PaymentContextProvider from "@/common/context/PaymentContextProvider";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
    duration: 1000,
    fade: true,
});


const queryClient = new QueryClient({})

const defaultSheetOptions: NativeStackNavigationOptions = {
    headerTitleStyle: {
        color: palette.offwhite,
    },
    headerStyle: {
        backgroundColor: palette.black,
    },
    contentStyle: {
        backgroundColor: palette.black
    }
}

export default function RootLayout() {

    const sheetOptions = useCallback(({route}: TODO): NativeStackNavigationOptions => {

        const gestureDisabledRoutes = ['upload', 'album', 'now-playing']

        return {
            headerShown: false,
            gestureEnabled: !gestureDisabledRoutes.includes(route.params.screen),
            presentation: 'modal',
            ...defaultSheetOptions
        }
    }, [])

    return (
        <ActionSheetProvider>
            <RootSiblingParent>
                <PaymentContextProvider>
                    <QueryClientProvider client={queryClient}>
                        <GestureHandlerRootView style={{flex: 1}}>
                            <Stack>
                                <Stack.Screen
                                    name="(tabs)"
                                    options={{headerShown: false}}
                                />

                                <Stack.Screen
                                    name="index"
                                    options={{ headerShown: false }}
                                />

                                <Stack.Screen
                                    name="onboarding"
                                    options={{headerShown: false}}
                                />

                                <Stack.Screen
                                    name="terms-of-service"
                                    options={{headerShown: false}}
                                />

                                <Stack.Screen
                                    name="privacy-policy"
                                    options={{headerShown: false}}
                                />

                                <Stack.Screen
                                    name="(sheets)"
                                    options={sheetOptions}
                                />

                                <Stack.Screen
                                    name="(fullscreens)"
                                    options={{
                                        headerShown: false,
                                        gestureEnabled: false,
                                        presentation: 'fullScreenModal',
                                        ...defaultSheetOptions
                                    }}
                                />
                            </Stack>
                            <Globals />
                        </GestureHandlerRootView>
                    </QueryClientProvider>
                </PaymentContextProvider>
            </RootSiblingParent>
        </ActionSheetProvider>
    )
}