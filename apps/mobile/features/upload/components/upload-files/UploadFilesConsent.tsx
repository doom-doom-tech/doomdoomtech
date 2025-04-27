import {StyleSheet, Text, TouchableOpacity} from 'react-native'
import {useCallback, useMemo} from "react";
import RadioSelected from "@/assets/icons/RadioSelected";
import Radio from "@/assets/icons/Radio";
import {palette, spacing} from "@/theme";
import {useUploadSettings, useUploadSettingsStoreSelectors} from "@/features/upload/store/upload-settings";

interface UploadFilesConsentProps {

}

const UploadFilesConsent = ({}: UploadFilesConsentProps) => {

    const {consent} = useUploadSettings()
    const setUploadSettingsState = useUploadSettingsStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                padding: spacing.m,
                marginHorizontal: spacing.m,
                backgroundColor: palette.grey,
                flexDirection: 'row',
                gap: spacing.s,
            },
            label: {
                width: '80%',
                color: palette.offwhite
            }
        })
    }, []);

    const handleConsent = useCallback(() => {
        setUploadSettingsState({ consent: !consent })
    }, [consent])

    return(
        <TouchableOpacity style={styles.wrapper} onPress={handleConsent}>
            { consent
                ? <RadioSelected color={palette.olive} />
                : <Radio />
            }
            <Text style={styles.label}>
                By checking this box, I confirm that I own all necessary rights to the content provided or have obtained permission from third parties to use it, and I agree to be responsible for any claims or disputes related to the content.
            </Text>
        </TouchableOpacity>
    )
}

export default UploadFilesConsent