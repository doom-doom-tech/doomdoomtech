import {StyleSheet, Text, View} from 'react-native'
import {useMemo} from "react";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";
import {palette, spacing} from "@/theme";
import UploadFilesPreview from "@/features/upload/components/upload-files/UploadFilesPreview";

interface UploadCompleteInformationProps {

}

const UploadCompleteInformation = ({}: UploadCompleteInformationProps) => {

    const title = useUploadStoreSelectors.title()
    const genre = useUploadStoreSelectors.genre()
    const artists = useUploadStoreSelectors.artists()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                borderBottomWidth: 1,
                paddingBottom: spacing.m,
                borderColor: palette.granite
            },
            title: {
                textAlign: 'center',
                fontSize: 18,
                color: palette.offwhite
            },
            artists: {
                textAlign: 'center',
                color: palette.granite
            },
            stats: {
                textAlign: 'center',
                color: palette.granite
            }
        })
    }, []);



    return(
        <View style={styles.wrapper}>
            <UploadFilesPreview />
            <Text style={styles.title}>
                {title}
            </Text>
            <Text style={styles.artists}>
                {artists
                    .map((artist, index) => artist.artist.getUsername())
                    .join(', ')
                }
            </Text>
        </View>
    )
}

export default UploadCompleteInformation