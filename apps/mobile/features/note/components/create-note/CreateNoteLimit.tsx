import {StyleSheet, View} from 'react-native'
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import Text from "@/common/components/Text";
import {usePaymentContext} from "@/common/context/PaymentContextProvider";
import {palette, spacing} from "@/theme";

const CreateNoteLimit = () => {

    const { premiumMember } = usePaymentContext()
    const user = useGlobalUserContext()

    const DAILY_LIMIT = premiumMember ? 10 : 3
    const POSTED_COUNT = user?.getSettings().daily_notes ?? 0

    const styles = StyleSheet.create({
        wrapper: {
            paddingVertical: spacing.s,
            paddingHorizontal: spacing.m,
            backgroundColor: DAILY_LIMIT - POSTED_COUNT === 0 ? palette.error : palette.olive + '50'
        },
        label: {
            color: palette.granite
        }
    })

    return(
        <View style={styles.wrapper}>
            <Text style={styles.label}>
                { DAILY_LIMIT - POSTED_COUNT } daily notes left
            </Text>
        </View>
    )
}

export default CreateNoteLimit