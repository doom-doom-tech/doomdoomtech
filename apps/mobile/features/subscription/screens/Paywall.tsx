import {ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View} from 'react-native'
import React, {useState} from "react";
import {Image} from "expo-image";
import PremiumBadge from "@/assets/icons/PremiumBadge";
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";
import CheckCircle from "@/assets/icons/CheckCircle";
import Button from '@/common/components/buttons/Button';
import Purchases from "react-native-purchases";
import {usePaymentContext} from "@/common/context/PaymentContextProvider";
import Close from "@/assets/icons/Close";
import {router} from "expo-router";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import Background from "@/assets/images/paywall.png"

const Paywall = () => {

    const { width, height } = useWindowDimensions()

    const user = useGlobalUserContext()

    const { packages, setCustomer } = usePaymentContext()

    const [loading, setLoading] = useState<boolean>(false)

    const styles = StyleSheet.create({
        screen: {
            flex:1 ,
        },
        wrapper: {
            position: 'relative',
            paddingBottom: 400
        },
        close: {
            position: "absolute",
            top: 50,
            right: spacing.m,
            padding: spacing.s,
            borderRadius: 400,
            backgroundColor: palette.darkgrey
        },
        background: {
            width: width, height: height / 2,
        },
        pane: {
            position: 'absolute',
            bottom: 0,
            width: width,
            height: height * 0.75,
            backgroundColor: palette.black,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
        },
        content: {
            flex: 1,
            paddingTop: 50,
            paddingHorizontal: spacing.m,
            position: 'relative',
        },
        badge: {
            position: 'absolute',
            top: -24,
            left: width / 2 - 33,
        },
        title: {
            fontSize: 24,
            fontWeight: 900,
            textAlign: 'center',
            color: palette.offwhite,
        },
        subtitle: {
            fontSize: 18,
            textAlign: 'center',
            lineHeight: 24,
            color: palette.granite,
        },
        usps: {
            gap: 8,
            marginVertical: 24,
        },
        usp: {
            fontSize: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.m,
            maxWidth: width - 50
        },
        text: {
            color: palette.granite,
            fontSize: 16,
            lineHeight: 20
        },
        disclaimer: {
            textAlign: 'center',
            fontSize: 12,
            color: palette.granite,
            marginTop: 8,
        }
    })

    const usps = [
        {
            label: "Streamline submissions with a professional demo inbox, making it easy to manage and review incoming tracks from artists.",
            user: "Get professional mastering tools to enhance your tracks' dynamic range."
        },
        {
            label: "Enable a label tag for artists, allowing them to send tracks directly to your label during their upload process—no more missed demos.",
            user: "Earn double credits for all your platform engagement"
        },
        {
            label: "Track demo performance at a glance, so you can focus only on the most promising, high-performing submissions.",
            user: "See detailed insights about who visited your profile"
        },
        {
            label: "See who’s viewing your label profile, giving you valuable insights into the artists and fans engaging with your brand.",
            user: "Increase your music's visibility and chances of appearing in playlists and recommendations."
        },
        {
            label: "",
            user: "Use up to 5 label tags per upload and spotlight your tracks to your favorite labels."
        },
        {
            label: "",
            user: "Post up to 10 notes per day instead of 3, and share your latest updates with your fans."
        },
    ]

    const triggerPayment = async () => {
        try {
            setLoading(true)

            const { customerInfo } = await Purchases.purchasePackage(packages[0]);
            setCustomer(customerInfo);
        } catch (error: any) {
            //
        } finally {
            setLoading(false)
        }
    }

    return(
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.wrapper}>
                <Image style={styles.background} source={Background} />

                <View style={styles.pane}>
                    <View style={styles.content}>
                        <PremiumBadge style={styles.badge} />

                        <Text style={styles.title}>
                            Boost your tracks
                        </Text>

                        <Text style={styles.subtitle}>
                            Elevate your music with professional tools and insights designed to boost your success
                        </Text>

                        <View style={styles.usps}>
                            { usps
                                .filter(usp => usp[user!.isLabel() ? 'label' : 'user'] !== "")
                                .map((usp, index) => (
                                <View style={styles.usp}>
                                    <CheckCircle color={palette.olive} />
                                    <Text style={styles.text}>
                                        {usp[user!.isLabel() ? 'label' : 'user']}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <Button
                            fill={'olive'}
                            loading={loading}
                            callback={triggerPayment}
                            label={"Try 1 month for free"}
                        />
                        <Text style={styles.disclaimer}>
                            1-month free trial, then €10/month. Auto-renews unless canceled before trial ends. Manage or cancel anytime in your account settings.
                        </Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.close} onPress={router.back}>
                    <Close color={palette.offwhite} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default Paywall