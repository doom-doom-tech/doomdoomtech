import {ScrollView, StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import FAQBlock from "@/features/credits/components/FAQ/FAQBlock";
import Screen from "@/common/components/Screen";
import {spacing} from "@/theme";
import CreditEarnBlock from "@/features/credits/components/FAQ/CreditEarnBlock";
import Header from "@/common/components/header/Header";

interface CreditsFAQProps {

}

const CreditsFAQ = ({}: CreditsFAQProps) => {
    
    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
                paddingBottom: 200
            },
        })
    }, []);
        
    return(
        <Screen>
            <Header title={"FAQ"} />
            <ScrollView contentContainerStyle={styles.wrapper}>
                <FAQBlock
                    question={"What are credits in Doomdoomtech?"}
                    answer={"Credits can be earned in various ways in Doomdoomtech. Below is an overview of every action you can earn credits with."}
                />
                <FAQBlock
                    question={"What can i buy with these credits?"}
                    answer={"Credits can be paid out. A minimum of 500 credits is required before you can checkout. 1 credit = €1.00"}
                />
                <FAQBlock
                    question={"How do i earn credits?"}
                    answer={"Earning credits is tied to specific actions and milestones within Doomdoomtech. Below is an overview of these actions and their respective credit value"}
                />

                <View style={{ marginBottom: 24 }}>
                    <CreditEarnBlock action={"1 stream (30 seconds playback)"} amount={0.01} />
                    <CreditEarnBlock action={"10 streams"} amount={0.1} />
                    <CreditEarnBlock action={"100 streams"} amount={1} />
                    <CreditEarnBlock action={"1.000 streams"} amount={10} />
                    <CreditEarnBlock action={"10.000 streams"} amount={100} />
                    <CreditEarnBlock action={"100.000 streams"} amount={1000} />
                </View>

                <View>
                    <CreditEarnBlock action={"Uploading a track"} amount={0.05} />
                    <CreditEarnBlock action={"Rating a track"} amount={0.0001} />
                    <CreditEarnBlock action={"Placing a comment"} amount={0.0005} />
                    <CreditEarnBlock action={"Sharing a track"} amount={0.001} />
                    <CreditEarnBlock action={"Saving a track"} amount={0.0003} />
                </View>
            </ScrollView>
        </Screen>
    )
}

export default CreditsFAQ