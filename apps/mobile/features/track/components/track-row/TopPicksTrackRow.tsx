import {StyleSheet, Text, View} from 'react-native'
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
import {useQueueContext} from "@/common/components/Queueable";


interface TrackRowProps {
    index?: number
    numbered?: boolean
    selected?: boolean
    selectable?: boolean
    onDragEnd?: () => unknown
    onDragStart?: () => unknown
    onRemove?: (track: Track) => unknown
    onSelect?: (track: Track) => unknown
    type: 'route' | 'drag' | 'remove' | 'no-action'
}

const TrackRow = ({selected, selectable, onDragStart, onDragEnd, onRemove = _.noop, numbered, index, type}: TrackRowProps) => {

    const track = useTrackContext()

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

    const RightComponent = useCallback(() => {
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
                <Fragment />
            )

            default: return (
                <Fragment />
            )
        }
    }, [type])

    const IndexedNumberComponent = useMemo(() => (
        <Text style={styles.index}>{String(index).padStart(2, '0')}</Text>
    ), [index])

    return(
        <View style={styles.wrapper}>
            <View style={styles.left}>
                { numbered && IndexedNumberComponent }
                {selectable && (
                    <Fragment>
                        {selected ? <RadioSelected color={palette.olive} /> : <Radio />}
                    </Fragment>
                )}
                <TrackCover size={65} />
                <TrackInformation />
            </View>
            <View>
                {RightComponent()}
            </View>
        </View>
    )
}

export default TrackRow