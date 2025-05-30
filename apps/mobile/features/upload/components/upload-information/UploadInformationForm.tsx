import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Input from "@/common/components/inputs/Input";
import {spacing} from "@/theme";
import SwitchConsent from "@/common/components/consent/SwitchConsent";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";
import UploadDescription from "@/features/upload/components/UploadDescription";

interface UploadInformationFormProps {

}

const UploadInformationForm = ({}: UploadInformationFormProps) => {

    const {setState: setUploadState } = useUploadStoreSelectors.actions()
    const explicit = useUploadStoreSelectors.explicit()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
                paddingHorizontal: spacing.m
            },
        })
    }, []);

    const handleChange = useCallback((field: string) => (value: string | boolean) => {
        setUploadState({ [field]: value })
    }, [])

    return(
        <View>
            <UploadDescription
                description={"Enter your track's title and indicate if it contains explicit content. \n\nNote: Make sure not to include artist names in the title. \n"}
            />

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

        </View>
    )
}

export default UploadInformationForm