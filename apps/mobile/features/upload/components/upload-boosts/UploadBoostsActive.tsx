import {StyleSheet, View} from 'react-native'
import React, {useCallback, useMemo} from "react";
import SwitchConsent from "@/common/components/consent/SwitchConsent";
import {palette, spacing} from "@/theme";
import {useUploadSettings, useUploadSettingsStoreSelectors} from "@/features/upload/store/upload-settings";
import {usePaymentContext} from "@/common/context/PaymentContextProvider";
import Text from "@/common/components/Text";

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
            disclaimer: {
                textAlign: 'center',
                fontSize: 12,
                color: palette.granite,
                marginTop: 8,
            }
        })
    }, []);

    const togglePremium = useCallback((premiumEnabled: boolean) => {
        setUploadSetingsState({ premiumEnabled })
    }, [])

    return(
        <View style={styles.wrapper}>
            <SwitchConsent label={"Activate"} value={premiumEnabled} callback={togglePremium} />
            <Text style={styles.disclaimer}>
                1-month free trial, then €10/month. Auto-renews unless canceled before trial ends. Manage or cancel anytime in your account settings.
            </Text>
        </View>
    )
}

export default UploadBoostsActive