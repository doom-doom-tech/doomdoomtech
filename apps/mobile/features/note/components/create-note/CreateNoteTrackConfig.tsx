import {StyleSheet, TouchableOpacity, View} from 'react-native'
import React, {useCallback, useEffect, useMemo, useState} from "react";
import Play from "@/assets/icons/Play";
import WaveformRenderer from "@/features/track/components/waveform/WaveformRenderer";
import {palette, spacing} from "@/theme";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {runOnJS, useSharedValue, withTiming} from "react-native-reanimated";
import TrackPlayer, {useProgress} from "react-native-track-player";
import useWaveform from "@/features/track/hooks/useWaveform";
import {useMediaStoreSelectors} from "@/common/store/media";

interface CreateNoteTrackConfigProps {

}

const CreateNoteTrackConfig = ({}: CreateNoteTrackConfigProps) => {

    const track = useMediaStoreSelectors.current()!

    const size = 330

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                padding: spacing.m,
                flexDirection: 'row',
                gap: spacing.m,
            },
        })
    }, []);

    const [progress, setProgress] = useState<number>(0);

    const { position, duration } = useProgress();

    const width = useSharedValue(0);
    const height = useSharedValue(50);
    const seeking = useSharedValue(false);
    const layoutX = useSharedValue(0);

    const [waveform, setWaveform] = useState();

    const waveformQuery = useWaveform(track.getWaveformSource());

    useEffect(() => {
        if (waveformQuery.isLoading || waveformQuery.isError || waveform) return;
        setWaveform(waveformQuery.data);
    }, [waveform, waveformQuery]);

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

    const gesture = Gesture.Simultaneous(
        Gesture.Tap()
            .onStart((event) => {
                'worklet';
                const relativeX = calculateProgressWorklet(event.absoluteX);
                finishSeekWorklet(relativeX);
            }),
        Gesture.Pan()
            .onStart(() => {
                'worklet';
                seeking.value = true;
            })
            .onUpdate((event) => {
                'worklet';
                calculateProgressWorklet(event.absoluteX);
            })
            .onEnd(() => {
                'worklet';
                finishSeekWorklet();
            })
    );

    if (waveformQuery.isLoading || waveformQuery.isError) return null;

    return(
        <View style={styles.wrapper}>
            <TouchableOpacity>
                <Play />
            </TouchableOpacity>
            <GestureDetector gesture={gesture}>
                <View style={{ width: size }}>
                    <WaveformRenderer
                        waveformData={waveformQuery.data}
                        width={size}
                        height={24}
                        color={palette.lightgrey}
                        playedColor={palette.olive}
                        progress={progress / duration}
                    />
                </View>
            </GestureDetector>
        </View>
    )
}

export default CreateNoteTrackConfig