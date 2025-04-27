import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import UserRow from "@/features/user/components/user-row/UserRow";
import UserContextProvider from "@/features/user/context/UserContextProvider";
import _ from 'lodash';
import UserRowMultiple from "@/features/user/components/user-row/UserRowMultiple";
import {router} from "expo-router";

interface FeedTrackHeaderProps {

}

const FeedTrackHeader = ({}: FeedTrackHeaderProps) => {

    const track = useTrackContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const handleRouteUser = useCallback(() => {
        router.push(`/user/${track.getMainArtist().getID()}`)
    }, [track])

    if(_.size(track.getArtists()) === 1) return (
        <View style={styles.wrapper}>
            <UserContextProvider user={track.getMainArtist()}>
                <UserRow type={"custom"} callback={handleRouteUser} />
            </UserContextProvider>
        </View>
    )

    return(
        <View style={styles.wrapper}>
            <UserRowMultiple users={track.getArtists()} />
        </View>
    )
}

export default FeedTrackHeader