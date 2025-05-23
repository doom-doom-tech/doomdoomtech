import {StyleSheet, TouchableOpacity} from 'react-native'
import {useCallback, useMemo} from "react";
import Coins from "@/assets/icons/Coins"
import Text from "@/common/components/Text";
import millify from "millify";
import {palette, spacing} from "@/theme";
import {router} from "expo-router";
import ChevronRight from '@/assets/icons/ChevronRight';

interface CreditFundsProps {
    amount: number
}

const CreditFunds = ({amount = 0}: CreditFundsProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                height: 56,
                gap: spacing.s,
                paddingHorizontal: spacing.m,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: palette.darkgrey,
                borderRadius: 4
            },
            label: {
                color: palette.offwhite,
                fontSize: 18
            }
        })
    }, []);

    const handleRouteCredits = useCallback(() => {
        router.push('/credits')
    }, [])

    return(
        <TouchableOpacity style={styles.wrapper} onPress={handleRouteCredits}>
            <Coins />
            <Text style={styles.label}>
                {millify(amount, { precision: 2 })} credits
            </Text>
            <ChevronRight />
        </TouchableOpacity>
    )
}

export default CreditFunds