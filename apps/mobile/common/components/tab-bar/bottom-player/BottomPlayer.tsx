import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Fragment, useCallback, useEffect, useMemo } from "react";
import { constants, palette, spacing } from "@/theme";
import BottomPlayerInformation from "@/common/components/tab-bar/bottom-player/BottomPlayerInformation";
import BottomPlayerAction from "@/common/components/tab-bar/bottom-player/BottomPlayerAction";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useMediaStoreSelectors } from "@/common/store/media";
import BottomPlayerProgress from "@/common/components/tab-bar/bottom-player/BottomPlayerProgress";
import TrackCover from "@/features/track/components/TrackCover";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import { router, usePathname } from "expo-router";

const BottomPlayer = () => {
    const { width } = useWindowDimensions();
    const pathname = usePathname();
    const current = useMediaStoreSelectors.current();

    // Derive media type from current track
    const mediaType = current ? current.getMediaType() : null;

    // Shared values for animations
    const audioTranslation = useSharedValue(mediaType === 'audio' ? 0 : 100);
    const audioOpacity = useSharedValue(mediaType === 'audio' ? 1 : 0);
    const videoTranslation = useSharedValue(mediaType === 'video' ? 0 : 100);
    const videoOpacity = useSharedValue(mediaType === 'video' ? 1 : 0);
    const containerHeight = useSharedValue(current ? constants.TABBAR_PLAYER_HEIGHT : 0);

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
        transform: [{ translateY: videoTranslation.value }],
    }));

    // Animate when mediaType changes
    useEffect(() => {
        if (mediaType === 'audio') {
            containerHeight.value = withTiming(constants.TABBAR_PLAYER_HEIGHT, { duration: 300 });
            audioTranslation.value = withTiming(0, { duration: 300 });
            audioOpacity.value = withTiming(1, { duration: 300 });
            videoTranslation.value = withTiming(100, { duration: 300 });
            videoOpacity.value = withTiming(0, { duration: 300 });
        } else if (mediaType === 'video') {
            containerHeight.value = withTiming(constants.TABBAR_PLAYER_HEIGHT, { duration: 300 });
            videoTranslation.value = withTiming(0, { duration: 300 });
            videoOpacity.value = withTiming(1, { duration: 300 });
            audioTranslation.value = withTiming(100, { duration: 300 });
            audioOpacity.value = withTiming(0, { duration: 300 });
        } else {
            // No current track
            containerHeight.value = withTiming(0, { duration: 300 });
            audioTranslation.value = withTiming(100, { duration: 300 });
            audioOpacity.value = withTiming(0, { duration: 300 });
            videoTranslation.value = withTiming(100, { duration: 300 });
            videoOpacity.value = withTiming(0, { duration: 300 });
        }
    }, [mediaType]);

    const handleExpandCurrentTrack = useCallback(() => {
        if (pathname === `/now-playing`) return;
        router.push(`/(sheets)/now-playing`);
    }, [pathname]);

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
            {current && mediaType === 'audio' && (
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
            {current && mediaType === 'video' && (
                <Animated.View
                    style={[styles.videoWrapper, animatedVideoStyle, { opacity: videoOpacity }]}
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
            )}
        </Animated.View>
    );
};

export default BottomPlayer;
