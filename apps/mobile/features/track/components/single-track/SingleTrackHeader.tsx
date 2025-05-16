import {DeviceEventEmitter} from 'react-native'
import {useCallback} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import Header from "@/common/components/header/Header";
import {palette} from "@/theme";
import Options from "@/assets/icons/Options";
import {useTrackStoreSelectors} from "@/features/track/store/track";

interface SingleTrackHeaderProps {

}

const SingleTrackHeader = ({}: SingleTrackHeaderProps) => {

    const track = useTrackContext()

    const setTrackState = useTrackStoreSelectors.setState()

    const triggerTrackOptions = useCallback(() => {
        setTrackState({ track })
        DeviceEventEmitter.emit('sheet:expand', { name: 'TrackOptions' })
    }, [track])

    const RightComponent = useCallback(() => (
        <Options color={palette.offwhite} onPress={triggerTrackOptions}/>
    ), [])

    return(
        <Header title={track.getTitle()} RightComponent={RightComponent} />
    )
}

export default SingleTrackHeader