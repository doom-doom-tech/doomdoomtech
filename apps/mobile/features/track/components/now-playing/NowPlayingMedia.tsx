import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {useMemo} from 'react';
import TrackCover from '@/features/track/components/TrackCover';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';
import { palette } from '@/theme';
import {LinearGradient} from "expo-linear-gradient";

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
                position: 'relative',
            },
            shadow: {
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: 200,
                width: '100%',
            }
        });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = scrollOffset
            ? interpolate(scrollOffset.value, [0, 300], [1, 0])
            : 1;

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
            <LinearGradient
                colors={[palette.black + '00', palette.black]}
                style={styles.shadow}
            />
        </Animated.View>
    );
};

export default NowPlayingMedia;