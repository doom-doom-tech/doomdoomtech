import {Platform, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {useTrackContext} from '@/features/track/context/TrackContextProvider';
import {useMediaStoreSelectors} from '@/common/store/media';
import {State, useActiveTrack, useProgress} from 'react-native-track-player';
import {ResizeMode, Video} from 'expo-av';
import {useVisiblityContext} from "@/common/context/VisiblityContextProvider";
import CachedImage from "@/common/components/CachedImage";
import {NativeTrack} from "@/features/queue/types";

interface TrackCoverProps {
    size?: number;
}

const SYNC_THRESHOLD = 5;

const TrackCover = ({ size = 100 }: TrackCoverProps) => {

    const track = useTrackContext();
    const state = useMediaStoreSelectors.state();

    const currentTrack: NativeTrack | undefined = useActiveTrack()

    const visible = useVisiblityContext()

    const { position: trackPosition } = useProgress();

    // Create a ref for the Video component from expo-av
    const videoRef = useRef<Video>(null);

    const styles = useMemo(
        () =>
            StyleSheet.create({
                wrapper: {
                    width: size,
                    height: size,
                    position: 'relative',
                },
                media: {
                    width: size,
                    height: size,
                },
            }),
        [size]
    );

    /**
     * Sync the video time with react-native-track-player
     */
    const syncVideoWithTrackPlayer = useCallback(async () => {
        if (track.getMediaType() !== 'video' || !videoRef.current) return;

        const status = await videoRef.current.getStatusAsync();
        if (!status.isLoaded) return;

        const videoPosition = status.positionMillis / 1000;
        const diff = Math.abs(videoPosition - trackPosition);

        if (diff > SYNC_THRESHOLD) {
            await videoRef.current.setPositionAsync(trackPosition * 1000);
        }
    }, [track, trackPosition]);

    /**
     * Handle play/pause logic when the track player state changes
     */
    useEffect(() => {
        if (!videoRef.current || !currentTrack) return;

        if (track.getID() !== currentTrack.id || track.getMediaType() !== 'video') return;

        const updatePlayerState = async () => {
            if (state === State.Playing) {
                await videoRef.current!.playAsync();
            } else if (state === State.Paused || state === State.Ready) {
                await videoRef.current!.pauseAsync();
            }
        };

        updatePlayerState();
        syncVideoWithTrackPlayer();
    }, [state, track, currentTrack, syncVideoWithTrackPlayer]);

    /**
     * If this is audio, render the cover image
     */
    if (track.getVideoSource()) {
        return (
            <View style={styles.wrapper}>
                <Video
                    ref={videoRef}
                    source={{ uri: track.getVideoSource() as string }}
                    style={styles.media}
                    resizeMode={ResizeMode.COVER}
                    isMuted={true}
                    isLooping={true}
                    shouldPlay={Platform.OS === 'ios' ? visible : false}
                />
            </View>
        );
    }

    if(track.getAudioSource()) {
        return (
            <CachedImage
                width={size}
                contentPosition={'center'}
                contentFit={'cover'}
                source={track.getCoverSource() as string}
                style={styles.media}
            />
        );
    }

    /**
     * Render the video using expo-av
     */
    return null
};

export default TrackCover;