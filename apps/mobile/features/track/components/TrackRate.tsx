import {DeviceEventEmitter, StyleSheet, TouchableOpacity, View} from 'react-native'
import {useCallback, useEffect, useRef, useState} from "react";
import {palette, spacing} from "@/theme";
import FlameFilled from "@/assets/icons/FlameFilled";
import {BlurView} from "expo-blur";
import useEventListener from "@/common/hooks/useEventListener";
import Track from "@/features/track/classes/Track";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import _ from "lodash";
import Flame from "@/assets/icons/Flame";
import {useRatingQueueStoreSelectors} from "@/features/track/store/rating-queue";

const TrackRate = () => {
    const track = useTrackContext()

    const debounce = useRef<NodeJS.Timeout>()

    const [amount, setAmount] = useState<number>(0)
    const [isRatingInitiator, setIsRatingInitiator] = useState<boolean>(false)
    const isRatingInitiatorRef = useRef(isRatingInitiator)

    const currentRatingQueue = useRatingQueueStoreSelectors.current()
    const setRatingQueueState = useRatingQueueStoreSelectors.setState()

    useEffect(() => {
        isRatingInitiatorRef.current = isRatingInitiator
    }, [isRatingInitiator])

    const styles = StyleSheet.create({
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

    const handleCompleteRating = useCallback(async (amount: number) => {
        if (!isRatingInitiatorRef.current) return;

        // Store rating in queue to send later
        setRatingQueueState({ current: { id: track.getID(), rating: amount } })

        // Update UI
        DeviceEventEmitter.emit('track:rate:fired', track, amount)

        // Reset state
        setIsRatingInitiator(false)
    }, [track, amount, isRatingInitiator])

    const initiateTimeout = (amount: number) => {
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => handleCompleteRating(amount), 2000)
    }

    const handleSetRating = (index: number) => () => {
        setIsRatingInitiator(true)
        initiateTimeout(index + 1)
        setAmount(index + 1)
    }

    const handleStartRating = (t: Track) => {
        if (track.getID() !== t.getID()) return
        setIsRatingInitiator(true)
        initiateTimeout(currentRatingQueue ? currentRatingQueue.rating : 1)
        setAmount(currentRatingQueue ? currentRatingQueue.rating : 1)
    }

    useEventListener('track:rate:start', handleStartRating)

    return (
        <View style={styles.wrapper}>
            <BlurView style={styles.blur}>
                { _.map(Array(5), (item, index) =>
                    <TouchableOpacity onPress={handleSetRating(index)} key={index}>
                        { amount > index ? <FlameFilled width={32} height={32} /> : <Flame width={32} height={32} /> }
                    </TouchableOpacity>
                )}
            </BlurView>
        </View>
    )
}

export default TrackRate