import {StyleSheet, View} from 'react-native'
import {Fragment, useMemo} from "react";
import {palette, spacing} from "@/theme";
import Text from "@/common/components/Text";
import {useUploadSettings} from "@/features/upload/store/upload-settings";

interface UploadCompletePaymentBannerProps {

}

const UploadCompletePaymentBanner = ({}: UploadCompletePaymentBannerProps) => {

    const { premiumEnabled } = useUploadSettings()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingHorizontal: spacing.m,
            },
            content: {
                gap: spacing.s,
                padding: spacing.m,
                borderRadius: 8,
                backgroundColor: palette.teal
            },
            title: {
                fontSize: 18,
                color: palette.offwhite,
                borderBottomWidth: 1,
                borderBottomColor: palette.offwhite
            },
            bottom: {
                borderTopWidth: 1,
                flexDirection: 'row',
                paddingVertical: spacing.s,
                borderColor: palette.offwhite,
                justifyContent: 'space-between',
            },
            total: {
                fontSize: 24,
                fontWeight: 'bold',
                color: palette.offwhite
            },
            price: {
                fontSize: 18,
                color: palette.offwhite
            },
        })
    }, []);

    if(!premiumEnabled) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    Doomdoomtech premium
                </Text>
                <View style={styles.bottom}>
                    <Text style={styles.total}>
                        Total
                    </Text>
                    <Text style={styles.price}>
                        €10/month
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default UploadCompletePaymentBanner