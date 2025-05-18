import {DeviceEventEmitter, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import TrackCover from "@/features/track/components/TrackCover";
import TrackInformation from "@/features/track/components/TrackInformation";
import {palette, spacing} from "@/theme";
import ChevronRight from "@/assets/icons/ChevronRight";
import {router} from "expo-router";
import DashCircle from "@/assets/icons/DashCircle";
import Animated, {FadeInDown} from "react-native-reanimated";
import RadioSelected from "@/assets/icons/RadioSelected";
import Radio from "@/assets/icons/Radio";
import Track from "@/features/track/classes/Track";
import _ from 'lodash';
import useMediaActions from "@/common/hooks/useMediaActions";
import Drag from "@/assets/icons/Drag";
import {useQueueContext} from "@/common/components/Queueable";
import TrackOptionsTrigger from "@/features/track/components/track-options/TrackOptionsTrigger";

interface TrackRowProps {
    index?: number
    numbered?: boolean
    selected?: boolean
    selectable?: boolean
    disableRouting?: boolean
    onDragEnd?: () => unknown
    onDragStart?: () => unknown
    onRemove?: (track: Track) => unknown
    onSelect?: (track: Track) => unknown
    type: 'route' | 'drag' | 'remove' | 'no-action' | 'options'
}

const TrackRow = ({selected, selectable, disableRouting, onDragStart, onDragEnd, onSelect = _.noop, onRemove = _.noop, numbered, index, type}: TrackRowProps) => {
    const track = useTrackContext()
    const { loadTrack } = useMediaActions()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: spacing.m
            },
            left: {
                flexDirection: 'row',
                alignItems: 'center',
                width: '60%',
                gap: spacing.m,
            },
            index: {
                color: palette.offwhite,
                fontSize: 18
            }
        })
    }, []);

    const listUUID = useQueueContext()

    const handleRouteTrack = useCallback(() => {
        router.push(`/track/${track.getID()}`)
    }, [])

    const handleRemoveTrack = useCallback(async () => {
        onRemove(track)
    }, [onRemove, track])

    const RightComponent = () => {
        switch (type) {
            case 'route': return(
                <Animated.View entering={FadeInDown} key={type}>
                    <ChevronRight onPress={handleRouteTrack} />
                </Animated.View>
            )
            case 'remove': return(
                <Animated.View entering={FadeInDown} key={type}>
                    <DashCircle color={palette.error} onPress={handleRemoveTrack} />
                </Animated.View>
            )
            case 'no-action': return (
                <Fragment />
            )
            case 'drag': return (
                <TouchableOpacity
                    onPressIn={onDragStart}
                    onPressOut={onDragEnd}>
                    <Drag />
                </TouchableOpacity>
            )
            case 'options': return (
                <TrackOptionsTrigger />
            )
            default: return (
                <Fragment />
            )
        }
    }

    const handleCallback = useCallback(async () => {
        if (selectable) return onSelect(track)

        // First emit the queue:construct event to ensure the queue is properly constructed
        DeviceEventEmitter.emit('queue:construct', { listUUID });

        // Then load and play the track
        await loadTrack(track)
        DeviceEventEmitter.emit('notes:mute')
    }, [onSelect, track, listUUID])

    const IndexedNumberComponent = useMemo(() => (
        <Text style={styles.index}>{String(index).padStart(2, '0')}</Text>
    ), [index])

    const ContentWrapper = useMemo(() => {
        switch (type) {
            case "route": return TouchableOpacity
            case "options": return TouchableOpacity
            case "drag": return View
            case "remove": return TouchableOpacity
            case "no-action": return TouchableOpacity
        }
    }, [type])

    return(
        <View style={styles.wrapper}>
            <ContentWrapper style={styles.left} activeOpacity={0.5} onPress={handleCallback}>
                { numbered && IndexedNumberComponent }
                { selectable && (
                    <Fragment>
                        {selected ? <RadioSelected color={palette.olive} /> : <Radio />}
                    </Fragment>
                )}
                <TrackCover size={65} />
                <TrackInformation selectable={selectable} disableRouting={disableRouting} />
            </ContentWrapper>
            <View>
                {RightComponent()}
            </View>
        </View>
    )
}

export default TrackRow