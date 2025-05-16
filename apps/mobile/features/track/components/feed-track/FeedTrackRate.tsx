import {useCallback, useState} from "react";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import TrackRate from "@/features/track/components/TrackRate";
import Track from "@/features/track/classes/Track";
import useEventListener from "@/common/hooks/useEventListener";

const FeedTrackRate = () => {
    const track = useTrackContext();

    const opacity = useSharedValue(0);
    const translate = useSharedValue(20);
    const [isActive, setIsActive] = useState(false); // New state to track active status

    const wrapperStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translate.value }],
        position: 'absolute',
        alignSelf: 'center',
        top: '35%',
        alignItems: 'center',
    }));

    const activate = useCallback(() => {
        setIsActive(true);
        opacity.value = withTiming(1);
        translate.value = withTiming(0);
    }, [track]);

    const deactivate = useCallback(() => {
        setIsActive(false);
        opacity.value = withTiming(0);
        translate.value = withTiming(20);
    }, [track]);

    const handleTriggerRating = useCallback((t: Track) => {
        if (track.getID() === t.getID()) activate();
    }, [track, activate]);

    const handleFiredRating = useCallback((t: Track) => {
        if (track.getID() === t.getID()) deactivate();
    }, [track, deactivate]);

    useEventListener('track:rate:start', handleTriggerRating);
    useEventListener('track:rate:fired', handleFiredRating);

    return (
        <Animated.View style={wrapperStyle} pointerEvents={isActive ? 'auto' : 'none'}>
            <TrackRate />
        </Animated.View>
    );
};

export default FeedTrackRate;