import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {runOnJS, useSharedValue, withTiming} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {palette, spacing} from '@/theme';
import useWaveform from '@/features/track/hooks/useWaveform';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import WaveformRenderer from '@/features/track/components/waveform/WaveformRenderer';
import Text from "@/common/components/Text";
import {secondsToTimeFormat} from "@/common/services/utilities";
import useCurrentTrack from "@/features/track/hooks/useCurrentTrack";

const NowPlayingWaveform = () => {

    const track = useCurrentTrack()
    const { width: responsiveWidth } = useWindowDimensions();

    const size = useMemo(() => responsiveWidth, [responsiveWidth]);

    const currentProgress = useProgress()

    const [progress, setProgress] = useState<number>(0);

    const { position, duration } = useProgress();

    const width = useSharedValue(0);
    const height = useSharedValue(50);
    const seeking = useSharedValue(false);
    const layoutX = useSharedValue(0);

    const [waveform, setWaveform] = useState();

    const waveformQuery = useWaveform(track?.getWaveformSource());

    useEffect(() => {
        if (waveformQuery.isLoading || waveformQuery.isError || waveform) return;
        setWaveform(waveformQuery.data);
    }, [waveform, waveformQuery]);

    const styles = StyleSheet.create({
        outer: {
            width: size,
            height: 50,
            alignItems: 'flex-start',
            justifyContent: 'center',
        },
        durations: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: spacing.m,
            paddingVertical: spacing.s,
        },
        duration: {
            fontSize: 24,
        },
        times: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: spacing.m
        },
        time: {
            color: palette.offwhite,
            fontSize: 18
        }
    });

    const emitSeekAction = useCallback(async (millis: number) => {
        setProgress(Math.floor(millis));
        await TrackPlayer.seekTo(Math.floor(millis));
    }, [track]);

    const handleUpdateLocalValue = useCallback((millis: number) => {
        setProgress(millis);
    }, []);

    const calculateProgressWorklet = (absoluteX: number) => {
        'worklet';
        const relativeX = Math.max(0, Math.min(size, absoluteX - layoutX.value));
        const newProgress = relativeX / size;
        const clampedProgress = Math.max(0, Math.min(1, newProgress));

        runOnJS(handleUpdateLocalValue)(Math.floor(clampedProgress * duration));

        width.value = relativeX;
        return relativeX;
    };

    const finishSeekWorklet = (currentWidth: number = width.value) => {
        'worklet';
        const percentage = Math.floor((currentWidth / size) * 100);
        const millis = (duration / 100) * percentage;

        runOnJS(emitSeekAction)(millis);

        seeking.value = false;
        height.value = withTiming(50);
    };

    const tapGesture = Gesture.Tap()
        .onStart((event) => {
            'worklet';
            const relativeX = calculateProgressWorklet(event.absoluteX);
            finishSeekWorklet(relativeX);
        });

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            'worklet';
            const dx = Math.abs(event.translationX);
            const dy = Math.abs(event.translationY);

            if (!seeking.value && dx > dy) {
                seeking.value = true;
            }

            if (seeking.value) {
                calculateProgressWorklet(event.absoluteX);
            }
        })
        .onEnd(() => {
            'worklet';
            if (seeking.value) {
                finishSeekWorklet();
                seeking.value = false;
            }
        });

// Combine gestures to only activate Pan if it wins
    const gesture = Gesture.Exclusive(
        panGesture,
        tapGesture
    );

    // Refactor useEffect to avoid reading seeking.value in render
    useEffect(() => {
        const updateProgress = () => {
            if (!seeking.value) { // Move the check outside render
                setProgress(position);
            }
        };
        updateProgress(); // Call it immediately
    }, [position, size]);

    if (waveformQuery.isLoading || waveformQuery.isError) return null;

    return (
        <View style={{ width: size }}>
            <GestureDetector gesture={gesture}>
                <View style={{ width: size }}>
                    <WaveformRenderer
                        waveformData={waveformQuery.data}
                        width={size}
                        height={100}
                        color={palette.lightgrey}
                        playedColor={palette.olive}
                        progress={progress / duration}
                    />
                </View>
            </GestureDetector>
            <View style={styles.times}>
                <Text style={styles.time}>
                    { secondsToTimeFormat(Math.floor(currentProgress.position)) }
                </Text>
                <Text style={styles.time}>
                    { secondsToTimeFormat(Math.floor(currentProgress.duration)) }
                </Text>
            </View>
        </View>
    );
};

export default NowPlayingWaveform;