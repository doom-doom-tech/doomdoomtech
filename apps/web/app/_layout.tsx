import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Initialize from "@/common/components/Initialize";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
    // defaultOptions: {
    // 	queries: {
    // 		refetchOnWindowFocus: false,
    // 		staleTime: 60000, // 1 minute
    // 		refetchOnReconnect: false,
    // 		refetchOnMount: false,
    // 		retry: 1,
    // 		networkMode: 'offlineFirst',
    // 	},
    // },
})

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="share" options={{headerShown: false}} />
                <Stack.Screen name="verify-email" options={{headerShown: false}} />
                <Stack.Screen name="privacy-policy" options={{headerShown: false}} />
            </Stack>
            <Initialize />
        </QueryClientProvider>
    );
}
