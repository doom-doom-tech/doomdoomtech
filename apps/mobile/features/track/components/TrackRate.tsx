import {DeviceEventEmitter, StyleSheet, TouchableOpacity, View} from 'react-native'
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {palette, spacing} from "@/theme";
import FlameFilled from "@/assets/icons/FlameFilled";
import {BlurView} from "expo-blur";
import useEventListener from "@/common/hooks/useEventListener";
import Track from "@/features/track/classes/Track";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import _ from "lodash";
import Flame from "@/assets/icons/Flame";
import useTrackLike from "@/features/track/hooks/useTrackLike";
import {useAlgoliaEvents} from "@/common/hooks/useAlgoliaEvents";
import {useParticleEmitter} from "@/common/components/ParticleAnimation";

interface FeedTrackLikesOverlayProps {
    onCompleteRating: (...args: Array<any>) => unknown
}

const TrackRate = ({onCompleteRating}: FeedTrackLikesOverlayProps) => {
    const track = useTrackContext()
    const emitParticles = useParticleEmitter();
    const likeTrackMutation = useTrackLike()

    const debounce = useRef<NodeJS.Timer>()

    // Initialize amount to 0 to allow the start event to trigger a state change
    const [amount, setAmount] = useState<number>(0)

    const [isRatingInitiator, setIsRatingInitiator] = useState<boolean>(false)
    const isRatingInitiatorRef = useRef(isRatingInitiator)

    useEffect(() => {
        isRatingInitiatorRef.current = isRatingInitiator
    }, [isRatingInitiator])

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                borderRadius: 100,
                overflow: 'hidden',
                backgroundColor: palette.darkgrey + '80'
            },
            blur: {
                width: '100%',
                height: 60,
                gap: spacing.s,
                padding: spacing.l,
                flexDirection: 'row',
                alignItems: 'center'
            }
        })
    }, []);

    const { rateTrack } = useAlgoliaEvents()

    const handleCompleteRating = useCallback(async (amount: number) => {

        if (!isRatingInitiatorRef.current) return;

        rateTrack(track.getID(), amount)

        emitParticles(<FlameFilled />, amount * 10);

        likeTrackMutation.mutate({
            trackID: track.getID(),
            amount
        })

        DeviceEventEmitter.emit('track:likes:increase', track, amount)

        onCompleteRating()
        setIsRatingInitiator(false) // Reset after completion
    }, [track, amount, onCompleteRating, isRatingInitiator])

    const initiateTimeout = useCallback((amount: number) => {
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => handleCompleteRating(amount), 2000)
    }, [amount, handleCompleteRating])

    const handleSetRating = useCallback((index: number) => () => {
        setIsRatingInitiator(true) // Mark as initiator when manually setting
        initiateTimeout(index + 1)
        setAmount(index + 1)
    }, [initiateTimeout])

    const activate = useCallback(() => {
        setAmount(1)
        setIsRatingInitiator(true) // Mark this instance as the initiator
        initiateTimeout(1)
    }, [initiateTimeout])

    const handleIncreaseRating = useCallback((t: Track) => {
        if(track.getID() !== t.getID()) return

        setAmount((prev) => {
            const newValue = Math.min(prev + 1, 5)
            setIsRatingInitiator(true)
            initiateTimeout(newValue)
            return newValue
        });
    }, [amount, track])

    const handleStartRating = useCallback((t: Track) => {
        if(track.getID() !== t.getID()) return
        setIsRatingInitiator(true)
        initiateTimeout(1)
        setAmount(1); // Now changes from 0 to 1, triggering a re-render
    }, [track, initiateTimeout])

    useEventListener('track:rate:start', handleStartRating)
    useEventListener('track:rate:trigger', activate)
    useEventListener('track:rate:increase', handleIncreaseRating)

    return(
        <View style={styles.wrapper}>
            <BlurView style={styles.blur}>
                { _.map(Array(5), (item, index) =>
                    <TouchableOpacity onPress={handleSetRating(index)} key={index}>
                        { amount > index  ? <FlameFilled width={32} height={32} /> : <Flame width={32} height={32} /> }
                    </TouchableOpacity>
                )}
            </BlurView>
        </View>
    )
}

export default TrackRate