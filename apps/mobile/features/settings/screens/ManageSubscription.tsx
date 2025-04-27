import {Alert, Linking, StyleSheet, View} from 'react-native'
import {useCallback, useEffect, useMemo, useState} from "react";
import Header from "@/common/components/header/Header";
import Screen from "@/common/components/Screen";
import PremiumBadge from "@/assets/icons/PremiumBadge";
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";
import _ from "lodash";
import {usePaymentContext} from "@/common/context/PaymentContextProvider";

interface ManageSubscriptionProps {

}

const ManageSubscription = ({}: ManageSubscriptionProps) => {

    const { getManagementURL, getSubscriptionStatus } = usePaymentContext()

    const [status, setStatus] = useState('active')

    useEffect(() => {
        (async () => setStatus(await getSubscriptionStatus()))()
    }, []);

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            content: {
                gap: spacing.m,
                alignItems: 'center',
                justifyContent: 'center'
            },
            title: {
                fontSize: 18,
                fontWeight: 'bold',
                color: palette.offwhite,
                textAlign: 'center'
            },
            item: {
                width: '100%',
                padding: spacing.m,
                borderBottomWidth: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderColor: palette.granite
            }
        })
    }, []);

    const handleCancelSubscription = useCallback(() => {
        Alert.alert("Cancel", "Are you sure you want to cancel your premium subscription?", [
            {
                text: 'Cancel',
                onPress: _.noop,
                style: 'cancel',
            },
            {
                text: "Confirm",
                style: 'destructive',
                onPress: async () => {
                    const url = await getManagementURL();
                    if (url) {
                        const supported = await Linking.canOpenURL(url);
                        if (supported) {
                            await Linking.openURL(url);
                        } else {
                            console.log("Cannot open URL:", url);
                        }
                    }
                }
            }
        ])
    }, [getManagementURL])

    return(
        <Screen>
            <Header title={"Subscription"} />
            <View style={styles.content}>
                <PremiumBadge />
                <Text style={styles.title}>
                    Doomdoomtech Premium
                </Text>
                <View style={styles.item}>
                    <Text style={{ fontWeight: 'bold', color: palette.offwhite }}>
                        Status
                    </Text>
                    <Text style={{ color: status === "expired" ? palette.rose : palette.olive }}>
                        {status}
                    </Text>
                </View>
                <View style={styles.item}>
                    <Text style={{ fontWeight: 'bold', color: palette.offwhite }}>
                        Per month
                    </Text>
                    <Text style={{ color: palette.offwhite }}>
                        €10.00
                    </Text>
                </View>
                <Text onPress={handleCancelSubscription} style={{ color: palette.error }}>
                    Cancel subscription
                </Text>
            </View>
        </Screen>
    )
}

export default ManageSubscription