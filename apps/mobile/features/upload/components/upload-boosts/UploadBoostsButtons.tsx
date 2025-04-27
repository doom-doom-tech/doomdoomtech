import {useEffect, useMemo} from "react";
import {useUploadStore} from "@/features/upload/store/upload";
import _ from "lodash";
import UploadBoostsButton from "@/features/upload/components/upload-boosts/UploadBoostsButton";
import Sparkle from "@/assets/icons/Sparkle"
import {spacing} from "@/theme";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useUploadSettings} from "@/features/upload/store/upload-settings";
import {usePaymentContext} from "@/common/context/PaymentContextProvider";

interface UploadBoostsButtonsProps {

}

const UploadBoostsButtons = ({}: UploadBoostsButtonsProps) => {

    const { boosts } = useUploadStore()

    const { premiumMember } = usePaymentContext()

    const { premiumEnabled } = useUploadSettings()

    const opacity = useSharedValue(1)

    const items = useMemo(() => ([
        {
            icon: <Sparkle />,
            field: 'mastering',
            label: 'Mastering',
            subtitle: 'Add the final touch to your tracks by improving dynamic range & perceived loudness',
            active: boosts.mastering
        },
    ]), [boosts])

    useEffect(() => {
        opacity.value = withTiming(premiumEnabled ? 1 : 0.5)
    }, [premiumEnabled]);

    const AnimatedStyle = useAnimatedStyle(() => ({
        gap: spacing.s,
        opacity: premiumMember ? 1 : premiumEnabled ? 1: 0.5,
        paddingHorizontal: spacing.m,
    }))



    return(
        <Animated.View style={AnimatedStyle}>
            { _.map(items, (item, index) => (
                <UploadBoostsButton {...item} key={index} />
            ))}
        </Animated.View>
    )
}

export default UploadBoostsButtons