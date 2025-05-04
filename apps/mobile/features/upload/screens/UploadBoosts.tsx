import {StyleSheet, useWindowDimensions, View} from 'react-native'
import React from "react";
import {spacing} from "@/theme";
import UploadBoostsHeader from "@/features/upload/components/upload-boosts/UploadBoostsHeader";
import UploadBoostsInfo from "@/features/upload/components/upload-boosts/UploadBoostsInfo";
import UploadBoostsActive from "@/features/upload/components/upload-boosts/UploadBoostsActive";
import Scroll from "@/common/components/Scroll";
import UploadBoostsButtons from "@/features/upload/components/upload-boosts/UploadBoostsButtons";
import UploadBoostsNext from "@/features/upload/components/upload-boosts/UploadBoostsNext";
import {usePaymentContext} from "@/common/context/PaymentContextProvider";
import Background from "@/assets/images/paywall.png";
import {Image} from "expo-image";

const UploadBoosts = () => {

    const {premiumMember} = usePaymentContext()

    const { width, height } = useWindowDimensions()


    const styles = StyleSheet.create({
        wrapper: {
            gap: spacing.m,
        },
        container: {
            gap: spacing.m,
            paddingBottom: 400,
        },
        background: {
            width: width, height: 200,
        },
    })

    if(premiumMember) return (
        <View style={styles.wrapper}>
            <UploadBoostsHeader />
            <Scroll contentContainerStyle={styles.container}>
                <UploadBoostsButtons />
                <UploadBoostsNext />
            </Scroll>
        </View>
    )

    return(
        <View style={styles.wrapper}>
            <UploadBoostsHeader />

            <Image style={styles.background} source={Background} />

            <Scroll contentContainerStyle={styles.container}>
                <UploadBoostsInfo />
                <UploadBoostsActive />
                <UploadBoostsButtons />
                <UploadBoostsNext />
            </Scroll>
        </View>
    )
}

export default UploadBoosts