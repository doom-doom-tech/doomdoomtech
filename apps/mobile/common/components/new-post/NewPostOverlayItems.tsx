import {StyleSheet, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import NewPostOverlayItem from "@/common/components/new-post/NewPostOverlayItem";
import _ from "lodash";
import Waveform from "@/assets/icons/Waveform";
import {spacing} from "@/theme";
import {router} from "expo-router";
import {wait} from "@/common/services/utilities";
import Note from "@/assets/icons/Note";
import Animated, {FadeInDown} from "react-native-reanimated";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import {initialUploadStore, useUploadStoreSelectors} from "@/features/upload/store/upload";
import {initialCreateNoteStore, useCreateNoteStoreSelectors} from "@/features/note/store/create-note";
import {initialUploadSettingsStore, useUploadSettingsStoreSelectors} from "@/features/upload/store/upload-settings";
import {usePaymentContext} from "@/common/context/PaymentContextProvider";
import useLatestTracks from "@/features/track/hooks/useLatestTracks";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";

interface NewPostOverlayItemsProps {
    onCancel: () => void
}

const NewPostOverlayItems = ({onCancel}: NewPostOverlayItemsProps) => {

    const currentUser = useGlobalUserContext()

    const { customer, premiumMember } = usePaymentContext()

    const userTracksQuery = useLatestTracks({
        userID: currentUser?.getID(),
        period: 'infinite'
    })

    const { setState: setUploadState } = useUploadStoreSelectors.actions()
    const setCreateNoteState = useCreateNoteStoreSelectors.setState()
    const setUploadSettingsState = useUploadSettingsStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.xl,
            },
            cancel: {
                justifyContent: 'center',
                paddingVertical: spacing.xl,
                alignItems: 'center',
            }
        })
    }, []);

    const triggerNewAlbumSheet = useCallback(async () => {
        onCancel()

        await wait(300)

        if(!currentUser)
            return router.push('/auth')

        if(currentUser.getTracksCount() === 0)
            return Toast.show('Upload atleast 1 track first', TOASTCONFIG.warning)

        router.push('/album/create')
    }, [userTracksQuery])

    const triggerUploadSheet = useCallback(async () => {
        onCancel()

        await wait(300)

        if(!currentUser) return router.push('/auth')

        setUploadState({
            ...initialUploadStore,
            artists: [{
                artist: currentUser!,
                role: "Artist",
                royalties: 100
            }]
        })

        setUploadSettingsState({
            ...initialUploadSettingsStore,
            labelTagsAmount: premiumMember ? 5 : 1
        })

        router.push('/upload/overview')
    }, [premiumMember])

    const triggerCreateNoteSheet = useCallback(async () => {
        onCancel()

        await wait(300)

        if(!currentUser) return router.push('/auth')

        setCreateNoteState(initialCreateNoteStore)

        router.push('/create-note')
    }, [])

    const items = useMemo(() => ([
        // {
        //     icon: <Album />,
        //     label: 'Drop an album',
        //     callback: triggerNewAlbumSheet
        // },
        {
            icon: <Waveform />,
            label: 'Upload a track',
            callback: triggerUploadSheet
        },
        {
            icon: <Note />,
            label: 'Share a note',
            callback: triggerCreateNoteSheet
        },
        {
            icon: <Fragment />,
            label: 'Cancel',
            callback: onCancel
        },
    ]), [])

    return(
        <View style={styles.wrapper}>
            { _.map(items, (item, index) => (
                <Animated.View entering={FadeInDown.delay((index + 3) * 100)} key={`item-${index}`}>
                    <NewPostOverlayItem {...item} key={index} />
                </Animated.View>
            ))}
        </View>
    )
}

export default NewPostOverlayItems