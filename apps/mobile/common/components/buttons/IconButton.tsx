import {DeviceEventEmitter, StyleSheet, TouchableOpacity, View} from 'react-native'
import {ReactElement, useMemo} from "react";
import {palette} from "@/theme";
import {usePaymentContext} from "@/common/context/PaymentContextProvider";
import PremiumBadge from "@/assets/icons/PremiumBadge";

interface IconButtonProps {
    notify?: boolean
    icon: ReactElement
    fill: keyof typeof palette
    premium?: boolean
    callback: (...args: Array<any>) => unknown
}

const IconButton = ({notify, premium, icon, fill, callback}: IconButtonProps) => {

    const { premiumMember } = usePaymentContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                borderRadius: 4,
                width: 50, height: 50,
                backgroundColor: palette[fill]
            },
            touchable: {
                width: 50, height: 50,
                justifyContent: 'center',
                alignItems: 'center',
            },
            notify: {
                position: 'absolute',
                left: '40%',
                bottom: -6,
                width: 12, height: 12,
                borderRadius: 12,
                backgroundColor: palette.error
            }
        })
    }, [fill]);

    const handlePress = () => {
        if(premium && !premiumMember) {
            DeviceEventEmitter.emit('')
        }
    }

    return(
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.touchable} activeOpacity={0.5} onPress={callback}>
                {icon}
            </TouchableOpacity>
            { notify && <View style={styles.notify} /> }
            {/*{ premium && <PremiumBadge /> }*/}
        </View>
    )
}

export default IconButton