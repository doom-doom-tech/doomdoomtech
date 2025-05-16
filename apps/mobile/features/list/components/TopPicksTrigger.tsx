import {StyleSheet, TouchableOpacity} from 'react-native'
import {useCallback, useMemo, useRef, useState} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import Heart from "@/assets/icons/Heart";
import LottieView from "lottie-react-native";
import {router} from "expo-router";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import useListSaveTrack from "@/features/list/hooks/useListSaveTrack";
import useListRemoveTrack from "@/features/list/hooks/useListRemoveTrack";
import {useAlgoliaEvents} from "@/common/hooks/useAlgoliaEvents";
import useEventListener from "@/common/hooks/useEventListener";
import {Audio} from "expo-av";

interface TopPicksTriggerProps {

}

const TopPicksTrigger = ({}: TopPicksTriggerProps) => {

    const track = useTrackContext()

    const user = useGlobalUserContext()

    const animationReference = useRef<LottieView>(null)

    const saveTrackMutation = useListSaveTrack()
    const removeTrackMutation = useListRemoveTrack()

    const { saveToTopPicks } = useAlgoliaEvents()

    const [saved, setSaved] = useState<boolean>(track.saved())

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            animation: {
                width: 90,
                height: 90,
                position: 'absolute',
                top: -33,
                left: -33,
            }
        })
    }, []);

    const manageSaveTrack = useCallback(async () => {
        if(!user) return router.push('/auth')

        if(saved) {
            setSaved(false)
            return removeTrackMutation.mutate({ trackID: track.getID() })
        }

        saveTrackMutation.mutate({ trackID: track.getID() })
        saveToTopPicks(track.getID())

        const { sound } = await Audio.Sound.createAsync(require('@/assets/sounds/save.wav'));
        await sound.playAsync();
    }, [saved, track, user])

    const catchSaveTrackEvent = useCallback((trackID: number) => {
        if(trackID === track.getID()) setSaved(true)
    }, [track])

    const catchRemoveTrackEvent = useCallback((trackID: number) => {
        if(trackID === track.getID()) setSaved(false)
    }, [track])

    useEventListener('list:track:save', catchSaveTrackEvent)
    useEventListener('list:track:remove', catchRemoveTrackEvent)

    return(
        <TouchableOpacity style={styles.wrapper} onPress={manageSaveTrack}>
            <Heart/>

            { saved && (
                <LottieView
                    ref={animationReference}
                    autoPlay={true}
                    loop={false}
                    resizeMode={"cover"}
                    style={styles.animation}
                    source={require('@/assets/animations/save.json')}
                />
            )}
        </TouchableOpacity>
    )
}

export default TopPicksTrigger