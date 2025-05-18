import {StyleSheet, TouchableOpacity, View} from 'react-native'
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import Text from "@/common/components/Text";
import {usePaymentContext} from "@/common/context/PaymentContextProvider";
import {palette, spacing} from "@/theme";
import PremiumFeature from "@/assets/icons/PremiumFeature";
import {router} from "expo-router";

const CreateNoteLimit = () => {

    const { premiumMember } = usePaymentContext()
    const user = useGlobalUserContext()

    const DAILY_LIMIT = premiumMember ? 10 : 3
    const POSTED_COUNT = user?.getSettings().daily_notes ?? 0

    const styles = StyleSheet.create({
        wrapper: {
            paddingVertical: spacing.s,
            paddingHorizontal: spacing.m,
            backgroundColor: DAILY_LIMIT - POSTED_COUNT === 0 ? palette.error + '80' : palette.olive + '80'
        },
        label: {
            textAlign: 'center',
            color: palette.granite,
            alignItems: 'center',
            lineHeight: 24,
        },
        premium: {
            color: palette.premium
        }
    })

    const routePaywall = () => router.push('/paywall')

    if(DAILY_LIMIT - POSTED_COUNT === 0 && !premiumMember) return(
        <TouchableOpacity style={styles.wrapper} onPress={routePaywall}>
            <Text style={styles.label}>
                no notes left today. <Text style={styles.premium}>Get more <PremiumFeature /></Text>
            </Text>
        </TouchableOpacity>
    )

    if(DAILY_LIMIT - POSTED_COUNT === 0) return(
        <TouchableOpacity style={styles.wrapper}>
            <Text style={styles.label}>
                no notes left today.
            </Text>
        </TouchableOpacity>
    )

    return(
        <View style={styles.wrapper}>
            <Text style={styles.label}>
                { DAILY_LIMIT - POSTED_COUNT } daily notes left
            </Text>
        </View>
    )
}

export default CreateNoteLimit