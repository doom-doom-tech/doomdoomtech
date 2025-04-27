import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Fragment, ReactElement, useCallback, useMemo, useState} from "react";
import * as DocumentPicker from "expo-document-picker";
import {DocumentPickerAsset, DocumentPickerResult} from "expo-document-picker";
import {palette, spacing} from "@/theme";
import Toast from 'react-native-root-toast'
import {TOASTCONFIG} from "@/common/constants";
import _ from "lodash";
import {ImageBackground} from "expo-image";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";
import * as ImagePicker from "expo-image-picker";
import {ImagePickerAsset, ImagePickerResult} from "expo-image-picker";

interface UploadFilesButtonProps {
    label: string
    target: 'audio-video' | 'cover'
}

const UploadFilesButton = ({label, target}: UploadFilesButtonProps) => {

    const { setState: setUploadState  } = useUploadStoreSelectors.actions()

    const files = useUploadStoreSelectors.files()

    const [loading, setLoading] = useState<boolean>(false)
    const [asset, setAsset] = useState<DocumentPickerAsset | ImagePickerAsset & { name: string }>()

    const hasFile = useMemo(() => {
        switch (target) {
            case "audio-video": return _.some(files, (file: DocumentPickerAsset) => {
                return file.mimeType!.startsWith('audio') || file.mimeType!.startsWith('video')
            })

            case "cover": return _.some(files, (file: ImagePicker.ImagePickerAsset) => {
                return file.mimeType!.startsWith('image')
            })
        }
    }, [files])

    const styles = useMemo(() => {
        return StyleSheet.create({
            border: {
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: palette.offwhite,
                borderRadius: 5,
                height: 50,
            },
            wrapper: {
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: palette.offwhite,
                overflow: 'hidden',
                padding: spacing.m,
            },
            background: {
                width: '120%',
                position: 'absolute',
                opacity: 0.5,
                objectFit: 'cover',
                height: 50,
            },
            label: {
                color: palette.offwhite
            }
        })
    }, [hasFile]);

    const mimes = useMemo(() => {
        switch (target) {
            case 'audio-video': return [
                'audio/mpeg',
                'audio/ogg',
                'audio/wav',
                'video/mp4',
                'video/mpeg',
                'video/webm',
                'video/quicktime',
                'video/3gpp',
                'video/3gpp2',
                'video/x-matroska',
                'video/ogg',
                'video/mp2t',
                'video/x-ms-asf',
                'video/x-ms-wmv'
            ]

            case 'cover': return [
                'image/jpg',
                'image/jpeg',
                'image/png',
                'image/bmp',
                'image/tiff',
                'image/webp',
                'image/heif',
                'image/heic',
                'image/avif',
            ]
        }
    }, [target])

    const triggerUploadAsset = useCallback(async () => {
        try {
            setLoading(true)

            let result: ImagePickerResult | DocumentPickerResult

            if(target === 'cover') {
                result = await ImagePicker.launchImageLibraryAsync()
            } else {
                result = await DocumentPicker.getDocumentAsync({
                    copyToCacheDirectory: true,
                    type: mimes
                })
            }

            if (result.canceled) return Toast.show("Upload cancelled", TOASTCONFIG.warning)

            let pickedFile: ImagePickerAsset & { name: string } | DocumentPickerAsset = _.first(result.assets)

            if(!("name" in pickedFile)) {
                _.set(pickedFile, 'name', (pickedFile as ImagePickerAsset).uri.substring((pickedFile as ImagePickerAsset).uri.lastIndexOf('/') + 1, (pickedFile as ImagePickerAsset).uri.length))
            }

            if(!pickedFile) throw new Error("There was problems processing your file")

            let extension = _.last(pickedFile.name.split('.'))

            // Server cant handle JPEG
            if (extension === 'jpeg') extension = 'jpg';

            // Rename files
            if (pickedFile.mimeType?.startsWith('audio')) {
                pickedFile.name = `audio.${extension}`;
            } else if (pickedFile.mimeType?.startsWith('video')) {
                pickedFile.name = `video.${extension}`;
            } else if (pickedFile.mimeType?.startsWith('image')) {
                pickedFile.name = `cover.${extension}`;
            }

            /** Set local asset state **/
            setAsset(pickedFile)

            /** Append to store files **/
            let updatedFiles = [...files];

            if (target === 'audio-video') {
                // Remove existing audio/video files
                updatedFiles = updatedFiles.filter(file =>
                    !file.mimeType?.startsWith('audio') && !file.mimeType?.startsWith('video')
                );
            } else if (target === 'cover') {
                // Remove existing image files
                updatedFiles = updatedFiles.filter(file =>
                    !file.mimeType?.startsWith('image')
                );
            }

            setUploadState({ files: [...updatedFiles, pickedFile] })

            /** Set store preview source **/
            if(['image', 'video'].some(type => pickedFile.mimeType?.startsWith(type))) {
                setUploadState({ preview: pickedFile?.uri })
            }
        } catch (error: any) {
            Toast.show(error.message, TOASTCONFIG.error)
        } finally {
            setLoading(false)
        }
    }, [files])

    const Content = useMemo((): string | ReactElement => {
        if(asset) return asset.name
        if(loading) return <ActivityIndicator color={palette.olive} />
        return label
    }, [asset, loading, label])

    const Preview = useCallback(() => {
        if(!asset) return <Fragment />

        if(asset.mimeType?.startsWith('audio')) {
            return
        }

        if(asset.mimeType?.startsWith('video')) {
            return
        }

        if(asset.mimeType?.startsWith('image')) {
            return <ImageBackground source={asset?.uri} style={styles.background} />
        }
    }, [asset])

    return(
        <View  style={styles.border}>
            <TouchableOpacity style={styles.wrapper} onPress={triggerUploadAsset}>
                <Preview />
                <Text style={styles.label}>
                    {Content}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default UploadFilesButton