import {DeviceEventEmitter, StyleSheet} from 'react-native'
import {useCallback, useMemo} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import Header from "@/common/components/header/Header";
import More from "@/assets/icons/More";
import {useActionSheet} from '@expo/react-native-action-sheet'
import {palette} from "@/theme";

interface SingleTrackHeaderProps {

}

const SingleTrackHeader = ({}: SingleTrackHeaderProps) => {

    const track = useTrackContext()

    const { showActionSheetWithOptions } = useActionSheet()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const triggerTrackOptions = useCallback(() => {
        DeviceEventEmitter.emit('sheet:expand', { name: 'TrackOptions' })
    }, [])

    const RightComponent = useCallback(() => (
        <More color={palette.offwhite} onPress={triggerTrackOptions}/>
    ), [])

    return(
        <Header title={track.getTitle()} RightComponent={RightComponent} />
    )
}

export default SingleTrackHeader