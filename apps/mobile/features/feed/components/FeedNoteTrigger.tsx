import React, {Fragment} from 'react';
import {StyleSheet, TouchableOpacity} from "react-native";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import UserCircle from "@/features/user/components/UserCircle";
import {palette, spacing} from "@/theme";
import Text from "@/common/components/Text";
import {router} from "expo-router";

const styles = StyleSheet.create({
    wrapper: {
        padding: spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.m,
        borderBottomWidth: 1,
        borderColor: palette.granite
    },
    label: {
        fontSize: 18,
        color: palette.granite,
    }
})

const FeedNoteTrigger = () => {

    const user = useGlobalUserContext();

    const handlePress = () => router.push('/create-note')

    if(!user) return <Fragment />

    return (
        <TouchableOpacity style={styles.wrapper} onPress={handlePress}>
            <UserCircle source={user.getImageSource()} size={32} />
            <Text style={styles.label}>
                What's on your mind?
            </Text>
        </TouchableOpacity>
    );
};

export default FeedNoteTrigger;