import {StyleSheet, TouchableOpacity, useWindowDimensions, View} from "react-native";
import {Fragment, useCallback, useEffect, useMemo} from "react";
import {constants, palette, spacing} from "@/theme";
import BottomPlayerInformation from "@/common/components/tab-bar/bottom-player/BottomPlayerInformation";
import BottomPlayerAction from "@/common/components/tab-bar/bottom-player/BottomPlayerAction";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useMediaStoreSelectors} from "@/common/store/media";
import BottomPlayerProgress from "@/common/components/tab-bar/bottom-player/BottomPlayerProgress";
import TrackCover from "@/features/track/components/TrackCover";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import {router, usePathname} from "expo-router";
import {Gesture, GestureDetector} from "react-native-gesture-handler";

const BottomPlayer = () => {
    const { width } = useWindowDimensions();
    const pathname = usePathname();
    const current = useMediaStoreSelectors.current();
    const videoPreviewMinimized = useMediaStoreSelectors.videoPreviewMinimized();
    const setMediaState = useMediaStoreSelectors.setState();

    // Derive media type from current track
    const mediaType = current ? current.getMediaType() : null;

    // Shared values for animations
    const audioTranslation = useSharedValue(mediaType === 'audio' ? 0 : 100);
    const audioOpacity = useSharedValue(mediaType === 'audio' ? 1 : 0);
    const videoTranslation = useSharedValue(mediaType === 'video' ? 0 : 100);
    const videoOpacity = useSharedValue(mediaType === 'video' ? 1 : 0);
    const containerHeight = useSharedValue(current ? constants.TABBAR_PLAYER_HEIGHT : 0);
    // Shared value for panning gesture
    const panY = useSharedValue(0);

    const styles = useMemo(() => StyleSheet.create({
        container: {
            position: 'relative',
        },
        audioWrapper: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: palette.purple,
        },
        videoWrapper: {
            position: 'absolute',
            right: spacing.m,
            bottom: spacing.m,
            width: 150,
            height: 150,
            backgroundColor: palette.black,
        },
        playerWrapper: {
            width: width,
            padding: spacing.m,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        content: {
            flexDirection: "row",
            gap: spacing.m,
            alignItems: "center",
        },
    }), [width, current]);

    // Animated styles
    const animatedContainerStyle = useAnimatedStyle(() => ({
        height: containerHeight.value,
    }));

    const animatedAudioStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: audioTranslation.value }],
    }));

    const animatedVideoStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: videoTranslation.value + panY.value },
        ],
    }));

    // Helper functions for animations
    const fadeInAudioPlayer = useCallback(() => {
        audioTranslation.value = withTiming(0, { duration: 300 });
        audioOpacity.value = withTiming(1, { duration: 300 });
    }, [audioTranslation, audioOpacity]);

    const fadeInVideoPreview = useCallback(() => {
        videoTranslation.value = withTiming(0, { duration: 300 });
        videoOpacity.value = withTiming(1, { duration: 300 });
    }, [videoTranslation, videoOpacity]);

    // Animate when mediaType or videoPreviewMinimized changes
    useEffect(() => {
        if (mediaType === 'audio' || (mediaType === 'video' && videoPreviewMinimized)) {
            containerHeight.value = withTiming(constants.TABBAR_PLAYER_HEIGHT, { duration: 300 });

            // First fade out video completely
            videoOpacity.value = withTiming(0, { duration: 200 }, () => {
                // Then move it out of view
                videoTranslation.value = withTiming(100, { duration: 100 });

                // And fade in audio player with a slight delay
                runOnJS(setTimeout)(fadeInAudioPlayer, 50);
            });
        } else if (mediaType === 'video' && !videoPreviewMinimized) {
            containerHeight.value = withTiming(constants.TABBAR_PLAYER_HEIGHT, { duration: 300 });

            // First fade out audio player
            audioOpacity.value = withTiming(0, { duration: 200 }, () => {
                // Then move it out of view
                audioTranslation.value = withTiming(100, { duration: 100 });

                // And fade in video preview with a slight delay
                runOnJS(setTimeout)(fadeInVideoPreview, 50);
            });
        } else {
            // No current track
            containerHeight.value = withTiming(0, { duration: 300 });
            audioTranslation.value = withTiming(100, { duration: 300 });
            audioOpacity.value = withTiming(0, { duration: 300 });
            videoTranslation.value = withTiming(100, { duration: 300 });
            videoOpacity.value = withTiming(0, { duration: 300 });
        }
    }, [mediaType, videoPreviewMinimized]);

    const handleExpandCurrentTrack = useCallback(() => {
        if (pathname === `/now-playing`) return;
        router.push(`/(sheets)/now-playing`);
    }, [pathname]);

    // Create a pan gesture for the video preview
    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            // Update panY to provide visual feedback during panning
            if (!videoPreviewMinimized && mediaType === 'video') {
                // Only allow downward movement (positive Y values)
                if (event.translationY > 0) {
                    panY.value = event.translationY;
                }

                // If swiping down far enough, minimize the video preview
                if (event.translationY > 100) {
                    // Animate the video preview out of view before minimizing
                    videoOpacity.value = withTiming(0, { duration: 200 }, () => {
                        // Only set videoPreviewMinimized after the fade-out animation completes
                        runOnJS(setMediaState)({ videoPreviewMinimized: true });
                    });
                    // Animate the panY value to smoothly move the video out of view
                    panY.value = withTiming(200, { duration: 200 });
                }
            }
        })
        .onEnd((event) => {
            // If not minimizing, animate back to original position
            if (event.translationY <= 100) {
                panY.value = withTiming(0, { duration: 150 });
            }
        });

    // Track ID reference to handle track changes
    const previousTrackIdRef = useSharedValue<number | null>(null);

    // Update track ID reference when current track changes and reset videoPreviewMinimized for videos
    useEffect(() => {
        // Get current track ID
        const currentId = current ? current.getID() : null;

        // If there's a track change
        if (current && currentId !== previousTrackIdRef.value) {
            // Store the new track ID
            previousTrackIdRef.value = currentId;

            // If the new track is a video, reset videoPreviewMinimized
            if (mediaType === 'video') {
                // Reset position
                panY.value = 0;
                // Reset videoPreviewMinimized state
                setMediaState({ videoPreviewMinimized: false });
            }
        }
    }, [current, mediaType, panY, setMediaState]);

    const Cover = useCallback(() => {
        if (!current) return <Fragment />;
        return (
            <TrackContextProvider track={current}>
                <TrackCover size={50} />
            </TrackContextProvider>
        );
    }, [current]);

    return (
        <Animated.View style={[styles.container, animatedContainerStyle]}>
            {current && (mediaType === 'audio' || videoPreviewMinimized) && (
                <Animated.View
                    style={[styles.audioWrapper, animatedAudioStyle, { opacity: audioOpacity }]}
                    pointerEvents={'auto'}
                >
                    <TouchableOpacity style={styles.playerWrapper} onPress={handleExpandCurrentTrack}>
                        <View style={styles.content}>
                            <Cover />
                            <BottomPlayerInformation />
                        </View>
                        <BottomPlayerAction />
                    </TouchableOpacity>
                    <BottomPlayerProgress />
                </Animated.View>
            )}
            {current && mediaType === 'video' && !videoPreviewMinimized && (
                <GestureDetector gesture={panGesture}>
                    <Animated.View
                        style={[styles.videoWrapper, animatedVideoStyle, {
                            opacity: videoOpacity,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 5,
                            },
                            shadowOpacity: 0.5,
                            shadowRadius: 4,
                            elevation: 5,
                        }]}
                        pointerEvents={'auto'}
                    >
                        <TrackContextProvider track={current}>
                            <TouchableOpacity
                                onPress={handleExpandCurrentTrack}
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 150,
                                    height: 150,
                                }}
                            >
                                <TrackCover size={150} />
                                <View style={{ position: 'absolute', width: 24, height: 24 }}>
                                    <BottomPlayerAction />
                                </View>
                            </TouchableOpacity>
                        </TrackContextProvider>
                    </Animated.View>
                </GestureDetector>
            )}
        </Animated.View>
    );
};

export default BottomPlayer;
