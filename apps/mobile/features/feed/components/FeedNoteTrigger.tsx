import React, {Fragment} from 'react';
import {StyleSheet, TouchableOpacity, View} from "react-native";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import UserCircle from "@/features/user/components/UserCircle";
import {palette, spacing} from "@/theme";
import Text from "@/common/components/Text";
import {router} from "expo-router";
import Gallery from '@/assets/icons/Gallery';
import * as ImagePicker from 'expo-image-picker';
import { useCreateNoteStoreSelectors } from '@/features/note/store/create-note';
import Toast from 'react-native-root-toast';
import { TOASTCONFIG } from '@/common/constants';

const styles = StyleSheet.create({
    wrapper: {
        padding: spacing.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacing.m,
        borderBottomWidth: 1,
        borderColor: palette.granite
    },
    label: {
        fontSize: 18,
        color: palette.granite,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.m
    }
})

const FeedNoteTrigger = () => {

    const user = useGlobalUserContext();

    const handlePress = () => router.push('/create-note')

    const setCreateNoteState = useCreateNoteStoreSelectors.setState()
    const attachments = useCreateNoteStoreSelectors.attachments()

    const handleSelectImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsMultipleSelection: true,
            selectionLimit: 5,
            orderedSelection: true,
            quality: 1,
        })

        if(result.canceled) return Toast.show('Upload cancelled', TOASTCONFIG.warning)

        setCreateNoteState({
            attachments: [...attachments, ...result.assets]
        })

        router.push('/create-note')
    }

    if(!user) return <Fragment />

    return (
        <TouchableOpacity style={styles.wrapper} onPress={handlePress}>
            <View style={styles.left}>
                <UserCircle source={user.getImageSource()} size={32} />
                <Text style={styles.label}>
                    What's on your mind?
                </Text>                
            </View>

            <TouchableOpacity onPress={handleSelectImages}>
                <Gallery color={palette.offwhite} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export default FeedNoteTrigger;