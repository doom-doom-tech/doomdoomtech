import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Input from "@/common/components/inputs/Input";
import {spacing} from "@/theme";
import SwitchConsent from "@/common/components/consent/SwitchConsent";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";

interface UploadInformationFormProps {

}

const UploadInformationForm = ({}: UploadInformationFormProps) => {

    const {setState: setUploadState } = useUploadStoreSelectors.actions()
    const explicit = useUploadStoreSelectors.explicit()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.s,
                paddingHorizontal: spacing.m
            },
        })
    }, []);

    const handleChange = useCallback((field: string) => (value: string | boolean) => {
        setUploadState({ [field]: value })
    }, [])

    return(
        <View style={styles.wrapper}>
            <Input
                placeholder={"Track title"}
                onChangeText={handleChange('title')} />

            <SwitchConsent
                label={"Explicit content"}
                value={explicit}
                callback={handleChange('explicit')}
            />
        </View>
    )
}

export default UploadInformationForm