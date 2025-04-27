import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import Header from "@/common/components/header/Header";
import Screen from "@/common/components/Screen";
import CreditProgress from "@/features/credits/components/CreditProgress";
import CreditFAQRoute from "@/features/credits/components/CreditFAQRoute";
import {spacing} from "@/theme";

const Credits = () => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m
            },
        })
    }, []);

    return(
        <Screen>
            <View style={styles.wrapper}>

                <Header title={'Credits'} />
                <CreditProgress />
                <CreditFAQRoute />
            </View>
        </Screen>
    )
}

export default Credits