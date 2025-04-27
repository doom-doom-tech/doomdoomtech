import {StyleSheet, useWindowDimensions} from 'react-native'
import React, {useMemo} from "react";
import Sheet from "@/common/components/Sheet";
import Background from "@/assets/images/subscription-presentation.png"
import SubscriptionPresentationPane from "@/features/subscription/components/subscription-presentation/SubscriptionPresentationPane";

interface SubscriptionPresentationProps {

}

const SubscriptionPresentation = ({}: SubscriptionPresentationProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({

        })
    }, []);

    const { height } = useWindowDimensions()

    return(
        <Sheet name={"SubscriptionPresentation"} snapPoints={[height]} background={Background}>
            <SubscriptionPresentationPane />
        </Sheet>
    )
}

export default SubscriptionPresentation