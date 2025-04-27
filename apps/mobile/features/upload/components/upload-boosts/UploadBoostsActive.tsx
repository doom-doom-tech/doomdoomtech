import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import SwitchConsent from "@/common/components/consent/SwitchConsent";
import {spacing} from "@/theme";
import {useUploadSettings, useUploadSettingsStoreSelectors} from "@/features/upload/store/upload-settings";
import {usePaymentContext} from "@/common/context/PaymentContextProvider";

interface UploadBoostsActiveProps {

}

const UploadBoostsActive = ({}: UploadBoostsActiveProps) => {

    const { premiumMember } = usePaymentContext()
    const { premiumEnabled } = useUploadSettings()
    const setUploadSetingsState = useUploadSettingsStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingHorizontal: spacing.m
            },
        })
    }, []);

    const togglePremium = useCallback((premiumEnabled: boolean) => {
        setUploadSetingsState({ premiumEnabled })
    }, [])

    return(
        <View style={styles.wrapper}>
            <SwitchConsent label={"Activate"} value={premiumEnabled} callback={togglePremium} />
        </View>
    )
}

export default UploadBoostsActive