import {Tabs} from "expo-router";
import BottomTabBar from "@/common/components/tab-bar/BottomTabBar";
import GlobalUserContextProvider from "@/features/user/context/GlobalUserContextProvider";
import Initialize from "@/common/components/Initialize";
import ParticleAnimation from "@/common/components/ParticleAnimation";
import TabBarContextProvider from "@/common/context/TabBarContextProvider";
import NewPostOverlay from "@/common/components/new-post/NewPostOverlay";
import SocketContextProvider from "@/common/context/SocketContextProvider";
import InviteCode from "@/features/auth/sheets/InviteCode";
import PremiumConfirmation from "@/common/sheets/PremiumConfirmation";
import TrackOptions from "@/features/track/sheets/TrackOptions";
import NowPlayingSheet from "@/features/track/sheets/NowPlaying";

const TabLayout = () => {
    return (
        <GlobalUserContextProvider>
            <SocketContextProvider>
                <Tabs
                    tabBar={props => (
                        <TabBarContextProvider value={props}>
                            <BottomTabBar />
                        </TabBarContextProvider>
                    )}
                    initialRouteName="(feed)"
                    screenOptions={{ headerShown: false }}>
                    <Tabs.Screen name={'(feed)'}/>
                </Tabs>

                <Initialize />
                <NewPostOverlay />
                <ParticleAnimation />

                <NowPlayingSheet />
                <InviteCode />
                <TrackOptions />
                <PremiumConfirmation />
            </SocketContextProvider>
        </GlobalUserContextProvider>
    )
}

export default TabLayout