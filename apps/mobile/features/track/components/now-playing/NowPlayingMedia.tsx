import {StyleSheet, useWindowDimensions} from 'react-native';
import {useMemo} from 'react';
import TrackCover from '@/features/track/components/TrackCover';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';

interface NowPlayingMediaProps {
    scrollOffset?: Animated.SharedValue<number>;
}

const NowPlayingMedia = ({ scrollOffset }: NowPlayingMediaProps) => {
    const { width } = useWindowDimensions();

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                marginTop: 0,
                width,
                height: width * 1.25,
                alignItems: 'center',
                justifyContent: 'center',
            },
        });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = scrollOffset
            ? interpolate(scrollOffset.value, [0, 300], [0.4, 0])
            : 0.4;

        const translation = scrollOffset
            ? interpolate(scrollOffset.value, [0, 300], [0, 300])
            : 0;

        const scale = scrollOffset
            ? interpolate(scrollOffset.value, [0, 300], [1, 1.2])
            : 1;

        return { opacity, transform: [{ translateY: translation }, { scale }]};
    });

    return (
        <Animated.View style={[styles.wrapper, animatedStyle]}>
            <TrackCover size={width * 1.25} />
        </Animated.View>
    );
};

export default NowPlayingMedia;