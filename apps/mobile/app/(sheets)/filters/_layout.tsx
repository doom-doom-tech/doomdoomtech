import {Stack} from "expo-router";
import {palette} from "@/theme";

export default function UploadModalLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                gestureEnabled: false,
                headerTitleStyle: {
                    color: palette.offwhite,
                },
                headerStyle: {
                    backgroundColor: palette.black,
                },
                contentStyle: {
                    backgroundColor: palette.black
                }

            }}>
            <Stack.Screen name="overview" />
            <Stack.Screen name="period" />
        </Stack>
    );
}