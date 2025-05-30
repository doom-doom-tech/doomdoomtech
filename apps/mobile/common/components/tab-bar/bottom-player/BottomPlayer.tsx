import { DeviceEventEmitter, StyleSheet, TouchableOpacity, useWindowDimensions, View, Text } from "react-native";
import { useCallback, useEffect, useMemo } from "react";
import { constants, palette, spacing } from "@/theme";
import BottomPlayerInformation from "@/common/components/tab-bar/bottom-player/BottomPlayerInformation";
import BottomPlayerAction from "@/common/components/tab-bar/bottom-player/BottomPlayerAction";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useMediaStoreSelectors } from "@/common/store/media";
import BottomPlayerProgress from "@/common/components/tab-bar/bottom-player/BottomPlayerProgress";
import TrackCover from "@/features/track/components/TrackCover";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import useCurrentTrack from "@/features/track/hooks/useCurrentTrack";
import { Image } from "expo-image";

const usePlayerAnimation = (mediaType: string | null, videoPreviewMinimized: boolean) => {
    const audioTranslation = useSharedValue(mediaType === "audio" ? 0 : 100);
    const audioOpacity = useSharedValue(mediaType === "audio" ? 1 : 0);
    const videoTranslation = useSharedValue(mediaType === "video" ? 0 : 100);
    const videoOpacity = useSharedValue(mediaType === "video" ? 1 : 0);
    const containerHeight = useSharedValue(mediaType ? constants.TABBAR_PLAYER_HEIGHT : 0);
    const panY = useSharedValue(0);

    const fadeInAudioPlayer = useCallback(() => {
        audioTranslation.value = withTiming(0, { duration: 300 });
        audioOpacity.value = withTiming(1, { duration: 300 });
    }, []);

    const fadeInVideoPreview = useCallback(() => {
        videoTranslation.value = withTiming(0, { duration: 300 });
        videoOpacity.value = withTiming(1, { duration: 300 });
    }, []);

    useEffect(() => {
        if (!mediaType) {
            containerHeight.value = withTiming(0, { duration: 300 });
            return;
        }

        if (mediaType === "audio" || (mediaType === "video" && videoPreviewMinimized)) {
            containerHeight.value = withTiming(constants.TABBAR_PLAYER_HEIGHT, { duration: 300 });
            videoOpacity.value = withTiming(0, { duration: 200 }, () => {
                videoTranslation.value = withTiming(100, { duration: 100 });
                runOnJS(setTimeout)(fadeInAudioPlayer, 50);
            });
        } else if (mediaType === "video" && !videoPreviewMinimized) {
            containerHeight.value = withTiming(constants.TABBAR_PLAYER_HEIGHT, { duration: 300 });
            audioOpacity.value = withTiming(0, { duration: 200 }, () => {
                audioTranslation.value = withTiming(100, { duration: 100 });
                runOnJS(setTimeout)(fadeInVideoPreview, 50);
            });
        }
    }, [mediaType, videoPreviewMinimized]);

    return { audioTranslation, audioOpacity, videoTranslation, videoOpacity, containerHeight, panY };
};

const AudioPlayer = ({ current, onExpand }: { current: any; onExpand: () => void }) => {
    const { width } = useWindowDimensions();
    const styles = useMemo(() => StyleSheet.create({
        wrapper: {
            width,
            padding: spacing.m,
            flexDirection: "row",
            justifyContent: "space-between",
            position: "relative",
        },
        content: {
            flexDirection: "row",
            gap: spacing.m,
            alignItems: "center",
        },
    }), [width]);

    return (
        <TouchableOpacity style={styles.wrapper} onPress={onExpand}>
            <Image source={current.getCoverSource()} style={{ ...StyleSheet.absoluteFillObject, opacity: 0.1 }} />
            <View style={styles.content}>
                <TrackContextProvider track={current}>
                    <TrackCover size={50} />
                </TrackContextProvider>
                <BottomPlayerInformation />
            </View>
            <BottomPlayerAction />
        </TouchableOpacity>
    );
};

const VideoPlayer = ({ current, onExpand, panGesture }: { current: any; onExpand: () => void; panGesture: any }) => (
    <GestureDetector gesture={panGesture}>
        <TrackContextProvider track={current}>
            <TouchableOpacity
                onPress={onExpand}
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 150,
                    height: 150,
                }}
            >
                <TrackCover size={150} />
                <View style={{ position: "absolute", width: 24, height: 24 }}>
                    <BottomPlayerAction />
                </View>
            </TouchableOpacity>
        </TrackContextProvider>
    </GestureDetector>
);

const BottomPlayer = () => {
    const current = useCurrentTrack();
    const videoPreviewMinimized = useMediaStoreSelectors.videoPreviewMinimized();
    const setMediaState = useMediaStoreSelectors.setState();
    const mediaType = current?.getMediaType?.() ?? null;

    const { audioTranslation, audioOpacity, videoTranslation, videoOpacity, containerHeight, panY } = usePlayerAnimation(
        mediaType,
        videoPreviewMinimized
    );

    useEffect(() => {
        if (current && mediaType === "video") {
            setMediaState({ videoPreviewMinimized: false });
        }
    }, [current, mediaType]);

    const styles = useMemo(() => StyleSheet.create({
        container: { position: "relative" },
        audioWrapper: {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: palette.black,
        },
        videoWrapper: {
            position: "absolute",
            right: spacing.m,
            bottom: spacing.m,
            width: 150,
            height: 150,
            backgroundColor: palette.black,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 5,
        },
    }), []);

    const handleExpand = useCallback(() => {
        DeviceEventEmitter.emit('sheet:expand', { name: 'NowPlaying' });
    }, []);

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (!videoPreviewMinimized && mediaType === "video") {
                if (event.translationY > 0) {
                    panY.value = event.translationY;
                }
                if (event.translationY > 100) {
                    videoOpacity.value = withTiming(0, { duration: 200 }, () => {
                        runOnJS(setMediaState)({ videoPreviewMinimized: true });
                    });
                    panY.value = withTiming(200, { duration: 200 });
                }
            }
        })
        .onEnd((event) => {
            if (event.translationY <= 100) {
                panY.value = withTiming(0, { duration: 150 });
            }
        });

    const animatedContainerStyle = useAnimatedStyle(() => ({ height: containerHeight.value }));
    const animatedAudioStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: audioTranslation.value }],
        opacity: audioOpacity.value,
    }));
    const animatedVideoStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: videoTranslation.value + panY.value }],
        opacity: videoOpacity.value,
    }));

    console.log("BottomPlayer:", { current, mediaType, videoPreviewMinimized });

    const shouldShowAudio = Boolean(current) && (mediaType === "audio" || videoPreviewMinimized);
    const shouldShowVideo = Boolean(current) && mediaType === "video" && !videoPreviewMinimized;

    return (
        <Animated.View style={[styles.container, animatedContainerStyle]}>
            {/* {shouldShowAudio && (
                <Animated.View style={[styles.audioWrapper, animatedAudioStyle]}>
                    <AudioPlayer current={current} onExpand={handleExpand} />
                    <BottomPlayerProgress />
                </Animated.View>
            )}

            {shouldShowVideo && (
                <Animated.View style={[styles.videoWrapper, animatedVideoStyle]}>
                    <VideoPlayer current={current} onExpand={handleExpand} panGesture={panGesture} />
                </Animated.View>
            )} */}

            {/* 🔥 Fallback audio view in case the conditions above fail */}
            {Boolean(current) && (
                <View style={[styles.audioWrapper]}>
                    <AudioPlayer current={current} onExpand={handleExpand} />
                    <BottomPlayerProgress />
                </View>
            )}
        </Animated.View>
    );
};

export default BottomPlayer;