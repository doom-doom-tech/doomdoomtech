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
                height: 50,
                gap: spacing.s,
                paddingHorizontal: 8,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: palette.darkgrey,
                borderRadius: 4
            },
            label: {
                color: palette.offwhite,
                fontSize: 18,
                lineHeight: 24,
                transform: [{ translateY: -2 }]
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
                {millify(amount, { precision: 2 })}
            </Text>
            <ChevronRight />
        </TouchableOpacity>
    )
}

export default CreditFunds