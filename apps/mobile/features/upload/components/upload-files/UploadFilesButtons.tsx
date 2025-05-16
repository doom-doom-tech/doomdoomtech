import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import UploadFilesButton from "@/features/upload/components/upload-files/UploadFilesButton";
import {spacing} from "@/theme";
import {useUploadStoreSelectors} from '@/features/upload/store/upload';

interface UploadFilesButtonsProps {

}

const UploadFilesButtons = ({}: UploadFilesButtonsProps) => {

    const files = useUploadStoreSelectors.files()
    const { setState: setUploadState } = useUploadStoreSelectors.actions()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.s,
                paddingHorizontal: spacing.m,
            },
        })
    }, []);

    const handleChangeURL = (external_url: string) => {
        setUploadState({ external_url })
    }

    return(
        <View style={styles.wrapper}>
            <UploadFilesButton label={'Audio/Video'} target={'audio-video'} />
            { !files.some(file => file.mimeType?.includes('video')) && <UploadFilesButton label={'Cover image'} target={'cover'} /> }
        </View>
    )
}

export default UploadFilesButtons