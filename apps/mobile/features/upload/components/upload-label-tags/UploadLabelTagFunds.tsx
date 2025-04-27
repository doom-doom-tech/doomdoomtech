import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {palette, spacing} from "@/theme";
import Hashtag from "@/assets/icons/Hashtag";
import Text from "@/common/components/Text";
import {useUploadSettings} from "@/features/upload/store/upload-settings";

interface UploadLabelTagFundsProps {

}

const UploadLabelTagFunds = ({}: UploadLabelTagFundsProps) => {

    const {labelTagsAmount} = useUploadSettings()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                paddingHorizontal: spacing.m,
                borderColor: palette.granite,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            },
            label: {
                fontSize: 24,
                color: palette.offwhite
            },
            funds: {
                gap: spacing.s,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: palette.darkgrey,
                padding: 8,
                borderRadius: 8,
            },
            amount: {
                fontSize: 18,
                color: palette.offwhite
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <Text style={styles.label}>
                Available tags
            </Text>
            <View style={styles.funds}>
                <Hashtag color={palette.olive} />
                <Text style={styles.amount}>
                    {labelTagsAmount}
                </Text>
            </View>
        </View>
    )
}

export default UploadLabelTagFunds