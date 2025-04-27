import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Input from "@/common/components/inputs/Input";
import {palette, spacing} from "@/theme";
import {useUploadStore, useUploadStoreSelectors} from "@/features/upload/store/upload";

interface UploadCompleteCaptionProps {

}

const UploadCompleteCaption = ({}: UploadCompleteCaptionProps) => {

    const { setState: setUploadState } = useUploadStoreSelectors.actions()
    const { caption } = useUploadStore()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingHorizontal: spacing.m,
                paddingBottom: spacing.m,
                borderColor: palette.granite,
                borderBottomWidth: 1
            },
        })
    }, []);

    const handleChange = useCallback((caption: string) => {
        setUploadState({ caption })
    }, [])

    return(
        <View style={styles.wrapper}>
            <Input
                value={caption}
                onChangeText={handleChange}
                placeholder={"Add a caption to your track"} />
        </View>
    )
}

export default UploadCompleteCaption