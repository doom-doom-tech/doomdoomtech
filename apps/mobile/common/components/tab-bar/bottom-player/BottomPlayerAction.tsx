import {ActivityIndicator, StyleSheet, TouchableOpacity} from "react-native";
import {Fragment, useCallback, useMemo} from "react";
import Play from "@/assets/icons/Play";
import Pause from "@/assets/icons/Pause";
import {palette, spacing} from "@/theme";
import TrackPlayer, {State, useActiveTrack, usePlaybackState} from "react-native-track-player"
import _ from "lodash";

const BottomPlayerAction = () => {

    const current = useActiveTrack()

    const state = usePlaybackState()

    const styles = useMemo(
        () =>
            StyleSheet.create({
                wrapper: {
                    padding: 10,
                    borderRadius: 50,
                    gap: spacing.m,
                    backgroundColor: palette.transparent,
                    flexDirection: 'row',
                    justifyContent: "center",
                    alignItems: "center",
                },
            }),
        []
    );

    const togglePlayback = useCallback(() => {
        switch (state.state) {
            case State.Playing:  return TrackPlayer.pause()
            case State.Paused:  return TrackPlayer.play()
            case State.Buffering: return _.noop()
            default: return TrackPlayer.play()
        }
    }, [state, current]);

    const Component = useCallback(() => {
        switch (state.state) {
            case State.Playing: return <Pause color={palette.offwhite} />
            case State.Paused: return <Play color={palette.offwhite} />
            case State.Buffering: return <ActivityIndicator />
            default: return <Play color={palette.offwhite} />
        }
    }, [state])

    if (!current) return <Fragment />

    return (
        <TouchableOpacity
            style={styles.wrapper}
            activeOpacity={0.5}
            onPress={togglePlayback}>
            <Component />
        </TouchableOpacity>
    );
};

export default BottomPlayerAction;