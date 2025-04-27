import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import Header from "@/common/components/header/Header";
import ManageAlbumCover from "@/features/album/components/manage-album/ManageAlbumCover";
import ManageAlbumInfo from "@/features/album/components/manage-album/ManageAlbumInfo";
import ManageAlbumTracks from "@/features/album/components/manage-album/ManageAlbumTracks";
import Button from "@/common/components/buttons/Button";
import {ScrollView} from 'react-native-gesture-handler';
import * as Crypto from "expo-crypto";
import Toast from "react-native-root-toast";
import {formatServerErrorResponse} from "@/common/services/utilities";
import {TOASTCONFIG} from "@/common/constants";
import {ImagePickerAsset} from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_BASE_URL, STORAGE_KEYS} from "@/common/services/api";
import * as FileSystem from "expo-file-system";
import _ from "lodash";
import {useManageAlbumStoreSelectors} from "@/features/album/store/manage-album";
import useAlbumCreate from "@/features/album/hooks/useAlbumCreate";
import {router} from "expo-router";
import ActionText from "@/common/components/ActionText";

interface ManageAlbumProps {

}

const ManageAlbum = ({}: ManageAlbumProps) => {

    const [dragging, setDragging] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const createAlbumMutation = useAlbumCreate()
    const cover = useManageAlbumStoreSelectors.cover()
    const name = useManageAlbumStoreSelectors.name()
    const tracks = useManageAlbumStoreSelectors.tracks()
    const release = useManageAlbumStoreSelectors.release()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const uploadFile = useCallback(async (file: ImagePickerAsset, uuid: string) => {
        try {
            const bearer = await AsyncStorage.getItem(STORAGE_KEYS.AUTH)

            const endpoint = `/media/upload?uuid=${uuid}&purpose=album.cover`

            const response = await FileSystem.uploadAsync(API_BASE_URL + endpoint, file.uri, {
                httpMethod: 'PUT',
                fieldName: 'file',
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                headers: {
                    'Authorization': String(bearer),
                    'Content-Type': 'multipart/form-data',
                },
            });

            return _.get(JSON.parse(response.body), 'data.upload.url', '')
        } catch (error: any) {
            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error)
        }
    }, [])

    const handleSubmit = useCallback(async () => {
        try {
            if(!cover) return Toast.show('Upload an album cover', TOASTCONFIG.error)
            if(!name) return Toast.show('Enter an album name', TOASTCONFIG.error)
            if(tracks.length === 0) return Toast.show('Add at least one track', TOASTCONFIG.error)

            setLoading(true)

            const uuid = Crypto.randomUUID()

            await createAlbumMutation.mutateAsync({
                uuid, name, release,
                ep: false,
                cover_url: await uploadFile(cover, uuid),
                tracks: tracks.map(track => track.getID())
            });

            Toast.show('Album created successfully', TOASTCONFIG.success);

            router.back()
        } catch (error: any) {
            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error)
        } finally {
            setLoading(false)
        }
    }, [cover, name, tracks, release, createAlbumMutation, uploadFile])

    const startDraggingTracks = useCallback(() => {
        setDragging(true)
    }, [])

    const endDraggingTracks = useCallback(() => {
        setDragging(false)
    }, [])

    const RightComponent = useCallback(() => (
        <ActionText callback={handleSubmit} label={"Create"} loading={loading} />
    ), [loading, handleSubmit])

    return(
        <View style={styles.wrapper}>
            <Header title={"Create album"} RightComponent={RightComponent} />

            <ScrollView scrollEnabled={!dragging}>
                <ManageAlbumCover />
                <ManageAlbumInfo />
                <ManageAlbumTracks onStartDragging={startDraggingTracks} onEndDragging={endDraggingTracks} />
            </ScrollView>
        </View>
    )
}

export default ManageAlbum
