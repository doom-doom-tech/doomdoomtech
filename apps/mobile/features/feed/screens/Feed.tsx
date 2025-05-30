import {StyleSheet, useWindowDimensions} from 'react-native'
import {useEffect, useMemo, useState} from "react";
import RandomFeed from "@/features/feed/screens/RandomFeed";
import {palette} from "@/theme";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import Screen from "@/common/components/Screen";
import FollowingFeed from "@/features/feed/screens/FollowingFeed";
import FeedHeader from "@/features/feed/components/FeedHeader";
import useGlobalUserContext from '@/features/user/hooks/useGlobalUserContext';
import { useSocketContext } from '@/common/context/SocketContextProvider';
import UploadProgressIndicator from '../components/progress-indicator/UploadProgressIndicator';

const Feed = () => {

    const user = useGlobalUserContext()

    const { width } = useWindowDimensions()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
                backgroundColor: palette.black
            },
        })
    }, []);

    const [index, setIndex] = useState(0)

    const [routes] = useState(user ? [
        { key: 'following', title: 'Following' },
        { key: 'all', title: 'All' },
    ] : [
        { key: 'all', title: 'All' },
        { key: 'following', title: 'Following' },
    ])

    const renderScene = SceneMap({
        following: FollowingFeed,
        all: RandomFeed,
    })

    const socket = useSocketContext()

    useEffect(() => {
        if (socket) {
            
            socket && socket.on("test", (data) => {
                console.log("test", data)
            })
        }
    }, [socket])

    return(
        <Screen>
            <FeedHeader />

            <UploadProgressIndicator />

            <TabView
                onIndexChange={setIndex}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: palette.transparent, height: 46, margin: 4, width: width / 2, borderBottomWidth: 2, borderColor: palette.rose}}
                        style={{ backgroundColor: palette.transparent, borderRadius: 50, marginBottom: 0, justifyContent: 'center', height: 56, elevation: 0 }}
                        activeColor={palette.offwhite}
                        inactiveColor={palette.offwhite + '80'}
                    />
                )}
            />
        </Screen>
    )
}

export default Feed