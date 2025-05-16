import React, {useCallback} from 'react';
import {DeviceEventEmitter, TouchableOpacity} from "react-native";
import Options from "@/assets/icons/Options";
import {useTrackStoreSelectors} from "@/features/track/store/track";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";

const TrackOptionsTrigger = () => {

    const track = useTrackContext()

    const setTrackState = useTrackStoreSelectors.setState()

    const triggerTrackOptions = useCallback(() => {
        setTrackState({ track })
        DeviceEventEmitter.emit('sheet:expand', { name: 'TrackOptions' })
    }, [track])
    
    return (
        <TouchableOpacity onPress={triggerTrackOptions}>
            <Options />
        </TouchableOpacity>
    );
};

export default TrackOptionsTrigger;