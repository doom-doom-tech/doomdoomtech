import {StyleSheet, TouchableOpacity, useWindowDimensions, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import {palette} from "@/theme";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import {useManageAlbumStoreSelectors} from "@/features/album/store/manage-album";
import Text from "@/common/components/Text";
import {ImageBackground} from "expo-image";

interface ManageAlbumCoverProps {

}

const ManageAlbumCover = ({}: ManageAlbumCoverProps) => {

    const { width } = useWindowDimensions()

    const setAlbumState = useManageAlbumStoreSelectors.setState()

    const [source, setSource] = useState<string | undefined>(undefined)

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                padding: 50,
                borderBottomWidth: 1,
                borderColor: palette.granite
            },
            trigger: {
                borderColor: palette.granite,
                justifyContent: 'center',
                borderStyle: 'dashed',
                borderWidth: 2,
                borderRadius: 8,
                height: width - 100
            },
            placeholder: {
                color: palette.offwhite,
                textAlign: 'center'
            }
        })
    }, []);

    const triggerUpload = useCallback(async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsMultipleSelection: false,
                quality: 1,
            });

            if (result.canceled) return Toast.show("Upload cancelled", TOASTCONFIG.warning)

            setSource(result.assets[0].uri)

            setAlbumState({ cover: result.assets[0] })
        } catch (error: any) {
        }
    }, [])

    return(
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.trigger} onPress={triggerUpload}>
                <Text style={styles.placeholder}>
                    Cover
                </Text>
                <ImageBackground source={source} style={StyleSheet.absoluteFillObject} />
            </TouchableOpacity>
        </View>
    )
}

export default ManageAlbumCover