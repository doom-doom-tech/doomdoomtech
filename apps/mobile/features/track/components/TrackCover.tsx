import {AppState, AppStateStatus, StyleSheet, View} from 'react-native';
import {Image} from 'expo-image';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTrackContext} from '@/features/track/context/TrackContextProvider';
import {useMediaStoreSelectors} from '@/common/store/media';
import {State, useProgress} from 'react-native-track-player';
import {ResizeMode, Video} from 'expo-av';
import {CONFIG} from "@/common/constants";

interface TrackCoverProps {
    size: number;
    visible?: boolean
}

const SYNC_THRESHOLD = 5;

const TrackCover = ({ size = 100, visible = true }: TrackCoverProps) => {

    const track = useTrackContext();
    const state = useMediaStoreSelectors.state();
    const currentTrack = useMediaStoreSelectors.current();

    const [currentAppState, setCurrentAppState] = useState<AppStateStatus>('active');
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
            console.log(`Syncing video: TrackPlayer at ${trackPosition}s, Video at ${videoPosition}s`);
            // setPositionAsync expects milliseconds
            await videoRef.current.setPositionAsync(trackPosition * 1000);
        }
    }, [track, trackPosition]);

    /**
     * Handle play/pause logic when the track player state changes
     */
    useEffect(() => {
        if (!videoRef.current) return;
        if (track.getUUID() !== currentTrack?.getUUID() || track.getMediaType() !== 'video') return;

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
     * Watch app state changes (optional if you want to handle background/foreground behavior)
     */
    useEffect(() => {
        const appStateListener = AppState.addEventListener('change', (event) => {
            setCurrentAppState(event);
        });
        return () => {
            appStateListener.remove();
        };
    }, []);

    /**
     * If this is audio, render the cover image
     */
    if (!track.getVideoSource()) {
        return (
            <Image
                placeholder={{ blurhash: CONFIG.BLURHASH }}
                transition={300}
                contentFit="cover"
                enableLiveTextInteraction={false}
                source={track.getCoverSource()}
                style={styles.media}
            />
        );
    }

    /**
     * Render the video using expo-av
     */
    return (
        <View style={styles.wrapper}>
            <Video
                ref={videoRef}
                source={{ uri: track.getVideoSource() as string }}
                style={styles.media}
                resizeMode={ResizeMode.COVER}
                isMuted={true}
                isLooping={true}
                shouldPlay={visible}
            />
        </View>
    );
};

export default TrackCover;