import {Stack} from "expo-router";
import {palette} from "@/theme";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function ManageAlbumLayout() {

    const { top } = useSafeAreaInsets()

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
                    paddingTop: top,
                    backgroundColor: palette.black
                }

            }}>
            <Stack.Screen name="create" />
            <Stack.Screen name="tracks" />
        </Stack>
    );
}