import {StyleSheet, Text, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";
import _ from "lodash";
import ErrorCircle from "@/assets/icons/ErrorCircle";
import CheckCircle from "@/assets/icons/CheckCircle";
import {palette, spacing} from "@/theme";
import {DocumentPickerAsset} from "expo-document-picker";
import DashCircle from "@/assets/icons/DashCircle";

interface UploadFilesChecksProps {}

const UploadFilesChecks = ({}: UploadFilesChecksProps) => {

    const files = useUploadStoreSelectors.files()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                padding: spacing.m,
                marginHorizontal: spacing.m,
                backgroundColor: palette.grey,
                gap: spacing.m
            },
            item: {
                gap: spacing.s,
                flexDirection: 'row',
                alignItems: 'center'
            },
            label: {
                color: palette.offwhite
            }
        })
    }, []);

    console.log(files);
    

    const FileSizeExceededIcon = useCallback(() => {

        if(_.isEmpty(files)) return <DashCircle />

        return _.some(files, (file: DocumentPickerAsset) => file.size! > 200000000)
            ? <ErrorCircle />
            : <CheckCircle color={palette.olive} />
    }, [files])

    const CoverRequiredIcon = useCallback(() => {
        if(_.some(files, (file: DocumentPickerAsset) => file.mimeType?.startsWith('audio'))) {
            return _.some(files, (file: DocumentPickerAsset) => file.mimeType?.startsWith('image'))
                ? <CheckCircle color={palette.olive} />
                : <ErrorCircle color={palette.error} />
        }
        return <DashCircle />
    }, [files])

    const AudioRequiredIcon = useCallback(() => {
        if(_.some(files, (file: DocumentPickerAsset) => file.mimeType?.startsWith('image'))) {
            return _.some(files, (file: DocumentPickerAsset) => file.mimeType?.startsWith('audio'))
                ? <CheckCircle color={palette.olive} />
                : <ErrorCircle color={palette.error} />
        }
        return <DashCircle />
    }, [files])

    return(
        <View style={styles.wrapper}>
            <View style={styles.item}>
                <FileSizeExceededIcon />
                <Text style={styles.label}>
                    Files should be less than 200Mb in size each
                </Text>
            </View>

            { _.some(files, (file: DocumentPickerAsset) => file.mimeType?.startsWith('audio')) && (
                <View style={styles.item}>
                    <CoverRequiredIcon />
                    <Text style={styles.label}>
                        Audio files require a cover image
                    </Text>
                </View>
            ) }
            
            { _.some(files, (file: DocumentPickerAsset) => file.mimeType?.startsWith('image')) && (
                <View style={styles.item}>
                    <AudioRequiredIcon />
                    <Text style={styles.label}>
                        Cover images require an audio file
                    </Text>
                </View>
            ) }

        </View>
    )
}

export default UploadFilesChecks