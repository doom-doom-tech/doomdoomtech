import {ScrollView, StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Header from "@/common/components/header/Header";
import UploadFilesPreview from "@/features/upload/components/upload-files/UploadFilesPreview";
import UploadFilesButtons from "@/features/upload/components/upload-files/UploadFilesButtons";
import UploadFilesChecks from "@/features/upload/components/upload-files/UploadFilesChecks";
import {spacing} from "@/theme";
import Button from "@/common/components/buttons/Button"
import UploadFilesConsent from "@/features/upload/components/upload-files/UploadFilesConsent";
import {router} from "expo-router";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";
import _ from "lodash";
import {DocumentPickerAsset} from "expo-document-picker";
import {useUploadSettings} from "@/features/upload/store/upload-settings";

interface UploadFilesProps {

}

const UploadFiles = ({}: UploadFilesProps) => {

    const files = useUploadStoreSelectors.files()

    const {consent} = useUploadSettings()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
            },
            content: {
                gap: spacing.m,
                paddingBottom: 200
            }
        })
    }, []);

    const handleNext = useCallback(async () => {
        router.push('/upload/information')
    }, [])

    const nextVisible = useMemo(() => {
        if(_.some(files, (file: DocumentPickerAsset) => file.mimeType?.startsWith('video'))) {
            return consent
        }

        if(_.some(files, (file: DocumentPickerAsset) => file.mimeType?.startsWith('audio'))) {
            return _.some(files, (file: DocumentPickerAsset) => file.mimeType?.startsWith('image')) && consent
        }

        if(_.some(files, (file: DocumentPickerAsset) => file.mimeType?.startsWith('image'))) {
            return _.some(files, (file: DocumentPickerAsset) => file.mimeType?.startsWith('audio')) && consent
        }
    }, [files, consent])

    return(
        <View style={styles.wrapper}>
            <Header title={"New track"} />
            <ScrollView contentContainerStyle={styles.content}>
                <UploadFilesPreview />
                <UploadFilesButtons />
                <UploadFilesChecks />
                <UploadFilesConsent />
                <Button disabled={!nextVisible} fill={'olive'} label={"Next"} callback={handleNext}/>
            </ScrollView>

        </View>
    )
}

export default UploadFiles