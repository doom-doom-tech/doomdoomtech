import {DeviceEventEmitter, StyleSheet, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import UserRow from "@/features/user/components/user-row/UserRow";
import UserContextProvider from "@/features/user/context/UserContextProvider";
import _ from 'lodash';
import UserRowMultiple from "@/features/user/components/user-row/UserRowMultiple";
import {router} from "expo-router";
import Options from "@/assets/icons/Options";
import {useTrackStoreSelectors} from "@/features/track/store/track";
import {wait} from "@/common/services/utilities";

interface FeedTrackHeaderProps {

}

const FeedTrackHeader = ({}: FeedTrackHeaderProps) => {

    const track = useTrackContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'relative',
                flexDirection: 'row',
                alignItems: 'center',
            },
            options: {
                position: 'absolute',
                right: 16,
            }
        })
    }, []);

    const setTrackState = useTrackStoreSelectors.setState()

    const handleTriggerOptions = async () => {
        setTrackState({ track })
        await wait(200)
        DeviceEventEmitter.emit('sheet:expand', { name: 'TrackOptions' })
    }

    const handleRouteUser = useCallback(() => {
        router.push(`/user/${track.getMainArtist().getID()}`)
    }, [track])

    if(_.size(track.getArtists()) === 1) return (
        <View style={styles.wrapper}>
            <UserContextProvider user={track.getMainArtist()}>
                <UserRow type={"custom"} callback={handleRouteUser} />
            </UserContextProvider>
            <TouchableOpacity onPress={handleTriggerOptions} style={styles.options}>
                <Options />
            </TouchableOpacity>
        </View>
    )

    return(
        <View style={styles.wrapper}>
            <UserRowMultiple users={track.getArtists()} />
            <TouchableOpacity onPress={handleTriggerOptions} style={styles.options}>
                <Options />
            </TouchableOpacity>
        </View>
    )
}

export default FeedTrackHeader