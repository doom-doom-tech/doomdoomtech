import {DeviceEventEmitter, StyleSheet, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Header from "@/common/components/header/Header";
import Options from "@/assets/icons/Options";
import {useTrackStoreSelectors} from "@/features/track/store/track";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";

interface NowPlayingHeaderProps {

}

const NowPlayingHeader = ({}: NowPlayingHeaderProps) => {

    const track = useTrackContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                width: '100%',
                position: 'absolute',
                top: 0
            }
        })
    }, []);

    const setTrackState = useTrackStoreSelectors.setState()

    const triggerTrackOptions = useCallback(() => {
        setTrackState({ track })
        DeviceEventEmitter.emit('sheet:expand', { name: 'TrackOptions' })
    }, [track, setTrackState])

    const RightComponent = useCallback(() => (
        <TouchableOpacity onPress={triggerTrackOptions}>
            <Options />
        </TouchableOpacity>
    ), [triggerTrackOptions])

    return(
        <View style={styles.wrapper}>
            <Header hideBackButton title={'Now Playing'} RightComponent={RightComponent} />
        </View>
    )
}

export default NowPlayingHeader
