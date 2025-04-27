import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {spacing} from "@/theme";
import UploadBoostsHeader from "@/features/upload/components/upload-boosts/UploadBoostsHeader";
import UploadBoostsInfo from "@/features/upload/components/upload-boosts/UploadBoostsInfo";
import UploadBoostsActive from "@/features/upload/components/upload-boosts/UploadBoostsActive";
import Scroll from "@/common/components/Scroll";
import UploadBoostsButtons from "@/features/upload/components/upload-boosts/UploadBoostsButtons";
import UploadBoostsNext from "@/features/upload/components/upload-boosts/UploadBoostsNext";
import {usePaymentContext} from "@/common/context/PaymentContextProvider";

const UploadBoosts = () => {

    const {premiumMember} = usePaymentContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
            },
            container: {
                gap: spacing.m,
                paddingBottom: 200,
            }
        })
    }, []);

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