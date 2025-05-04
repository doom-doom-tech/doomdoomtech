import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {ReactElement} from "react";
import {palette} from "@/theme";
import {usePaymentContext} from "@/common/context/PaymentContextProvider";
import PremiumFeature from "@/assets/icons/PremiumFeature";
import {router} from "expo-router";

interface IconButtonProps {
    notify?: boolean
    icon: ReactElement
    fill: keyof typeof palette
    premium?: boolean
    callback: (...args: Array<any>) => unknown
}

const IconButton = ({notify, premium, icon, fill, callback}: IconButtonProps) => {

    const { premiumMember } = usePaymentContext()

    const styles = StyleSheet.create({
        wrapper: {
            borderRadius: 4,
            width: 50, height: 50,
            backgroundColor: (premium && !premiumMember) ? palette[fill].concat('50') : palette[fill]
        },
        touchable: {
            width: 50, height: 50,
            justifyContent: 'center',
            alignItems: 'center',
        },
        icon: {
            position: 'absolute',
            left: 13,
            bottom: -12,
            width: 24, height: 24,
        },
    })

    const handlePress = () => {
        if(premium && !premiumMember) {
            router.push('/paywall')
        } else {
            callback()
        }
    }

    return(
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.touchable} activeOpacity={0.5} onPress={handlePress}>
                {icon}
            </TouchableOpacity>
            { premium && !premiumMember && (
                <View style={styles.icon}>
                    <PremiumFeature />
                </View>
            ) }
        </View>
    )
}

export default IconButton