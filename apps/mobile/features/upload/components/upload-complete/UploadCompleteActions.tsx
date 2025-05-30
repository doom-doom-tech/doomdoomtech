import {DeviceEventEmitter, StyleSheet, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import Button from "@/common/components/buttons/Button";
import {spacing} from "@/theme";
import {router} from "expo-router";
import {useUploadStore} from "@/features/upload/store/upload";
import useTrackCreate from "@/features/track/hooks/useTrackCreate";
import {TOASTCONFIG} from "@/common/constants";
import {formatServerErrorResponse, uploadFile, wait} from "@/common/services/utilities";
import Toast from "react-native-root-toast";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import {useUploadSettings} from "@/features/upload/store/upload-settings";
import {usePaymentContext} from "@/common/context/PaymentContextProvider";
import * as Crypto from "expo-crypto";
import Purchases from "react-native-purchases";
import {useUploadProgressStoreSelectors} from "@/features/upload/store/upload-progress";
import {TrackInterface} from "@/features/track/types";
import useUploadCreate from '../../hooks/useUploadCreate';
import { useQueryClient } from '@tanstack/react-query';
import { UserInterface } from '@/features/user/types';

interface UploadCompleteActionsProps {

}

const UploadCompleteActions = ({}: UploadCompleteActionsProps) => {

    const values = useUploadStore()

    const { premiumMember } = usePaymentContext()

    const { premiumEnabled } = useUploadSettings()

    const queryClient = useQueryClient()

    const { packages, setCustomer } = usePaymentContext()

    const [loading, setLoading] = useState<boolean>(false)

    const user = useGlobalUserContext()

    const createTrackMutation = useTrackCreate()

    const setUploadProgressState = useUploadProgressStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.s,
                paddingHorizontal: spacing.m
            },
        })
    }, []);

    const handleCreate = useCallback(async () => {
        try {
            if (!values.genre) return Toast.show("Select a genre", TOASTCONFIG.error);

            setLoading(true);

            if (premiumEnabled) {
                try {
                    const { customerInfo } = await Purchases.purchasePackage(packages[0]);
                    setCustomer(customerInfo);
                } catch (error) {
                    return;
                }
            }

            setTimeout(async () => {
                await wait(200);

                premiumEnabled
                    ? DeviceEventEmitter.emit('sheet:expand', { name: 'PaymentConfirmation' })
                    : Toast.show('Processing your upload', TOASTCONFIG.success);

                const uuid = Crypto.randomUUID();

                setUploadProgressState({
                    active: true, 
                    track: {
                        id: 0,
                        title: values.title,
                        cover_url: values.files.some(file => file.mimeType?.includes('image')) ? values.files.find(file => file.mimeType?.includes('image'))?.uri ?? null : null,
                        audio_url: values.files.find(file => file.mimeType?.includes('audio'))?.uri ?? null,
                        video_url: values.files.find(file => file.mimeType?.includes('video'))?.uri ?? null,
                        artists: [user?.serialize() as UserInterface]
                    } as TrackInterface
                })

                // Upload files concurrently and collect URLs
                const fileUploads = await Promise.all(
                    values.files.map(async (file) => {
                        switch (true) {
                            case file.mimeType?.includes('video'):
                                return { video_url: await uploadFile(file, uuid, 'track.video') };
                            case file.mimeType?.includes('audio'):
                                return { audio_url: await uploadFile(file, uuid, 'track.audio') };
                            case file.mimeType?.includes('image'):
                                return { cover_url: await uploadFile(file, uuid, 'track.cover') };
                            default:
                                return {};
                        }
                    })
                );

                // Merge file upload results into a single object
                const filePayload = fileUploads.reduce((acc, curr) => ({ ...acc, ...curr }), {});

                // Create payload as a regular object
                const payload = {
                    uuid: uuid,
                    title: values.title,
                    note: values.note.content,
                    explicit: values.explicit,
                    main_artist: user!.getID(),
                    caption: values.caption ?? '',
                    subgenreID: values.genre!.id,
                    tags: values.tags,
                    artists: values.artists.map(uploadableArtist => ({
                        role: uploadableArtist.role,
                        royalties: uploadableArtist.royalties,
                        userID: uploadableArtist.artist.getID(),
                    })),
                    services: premiumEnabled && values.boosts.mastering ? ['mastering'] : [],
                    ...filePayload
                };

                createTrackMutation.mutate(payload as any);
            }, 300);

            router.dismissTo('/upload/overview');
            router.back();

            router.replace('/feed')
        } catch (error: any) {
            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error);
        } finally {
            setLoading(false);
        }
    }, [values]);

    const handleCancel = useCallback(() => {
        router.dismissTo('/upload/overview')
        router.back()
    }, [])

    const label = useMemo(() => {
        if(premiumMember) return "Upload"
        return premiumEnabled ? "Start free trial" : "Upload"
    }, [premiumMember, premiumEnabled])

    return(
        <View style={styles.wrapper}>
            <Button fill={'olive'} label={label} callback={handleCreate} loading={loading} fullWidth />
            <Button fill={'transparent'} border={'granite'} color={'offwhite'} label={"Cancel"} callback={handleCancel} fullWidth />
        </View>
    )
}

export default UploadCompleteActions