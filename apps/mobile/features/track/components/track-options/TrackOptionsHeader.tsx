import React from 'react';
import {DeviceEventEmitter, StyleSheet, TouchableOpacity, useWindowDimensions, View} from "react-native";
import TrackInformation from "@/features/track/components/TrackInformation";
import TrackCover from "@/features/track/components/TrackCover";
import Close from "@/assets/icons/Close";
import {palette, spacing} from "@/theme";

const TrackOptionsHeader = () => {

    const {width } = useWindowDimensions()

    const styles = StyleSheet.create({
        wrapper: {
            position: 'relative',
            padding: spacing.m,
            width: width,
            borderBottomColor: palette.granite,
            borderWidth: 1,
        },
        content: {
            maxWidth: '50%',
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.m,
        },
        close: {
            position: "absolute",
            top: spacing.s,
            right: spacing.l,
            padding: spacing.s,
            borderRadius: 400,
            backgroundColor: palette.granite
        }
    })

    const handleCloseSheet = () => DeviceEventEmitter.emit('sheet:close', { name: 'TrackOptions' });

    return (
        <View style={styles.wrapper}>
            <View style={styles.content}>
                <TrackCover size={32} />
                <TrackInformation truncate />
            </View>


            <TouchableOpacity style={styles.close} onPress={handleCloseSheet}>
                <Close color={palette.offwhite} />
            </TouchableOpacity>
        </View>
    );
};

export default TrackOptionsHeader;