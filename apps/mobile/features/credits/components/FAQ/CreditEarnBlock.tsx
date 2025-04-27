import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {useMemo} from "react";
import Text from "@/common/components/Text";
import Coins from "@/assets/icons/Coins";
import {palette, spacing} from "@/theme";

interface CreditEarnBlockProps {
    action: string
    amount: number
}

const CreditEarnBlock = ({action, amount}: CreditEarnBlockProps) => {

    const { width } = useWindowDimensions()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                width: width,
                padding: spacing.m,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderColor: palette.granite
            },
            title: {
                color: palette.granite
            },
            amount: {
                color: palette.offwhite
            },
            credit: {
                padding: 4,
                gap: spacing.s,
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: palette.grey
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <Text style={styles.title}>
                {action}
            </Text>
            <View style={styles.credit}>
                <Coins />
                <Text style={styles.amount}>
                    {amount}
                </Text>
            </View>
        </View>
    )
}

export default CreditEarnBlock