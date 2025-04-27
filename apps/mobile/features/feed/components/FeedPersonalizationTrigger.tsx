import {StyleSheet, View} from 'react-native'
import {Fragment, useCallback, useEffect, useMemo} from "react";
import {palette, spacing, styling} from "@/theme";
import Brush from "@/assets/icons/Brush";
import Text from "@/common/components/Text";
import Button from "@/common/components/buttons/Button";
import {router} from "expo-router";
import {usePersonalizeStoreSelectors} from "@/features/feed/store/personalize";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";

const FeedPersonalizationTrigger = () => {

    const user = useGlobalUserContext()

    const visible = usePersonalizeStoreSelectors.visible()
    const setPersonalizeState = usePersonalizeStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.s,
                borderRadius: 4,
                padding: spacing.m,
                marginHorizontal: spacing.m,
                backgroundColor: palette.grey,
            },
            title: {
                fontSize: 18,
                fontWeight: 'bold',
                color: palette.offwhite,
            },
            subtitle: {
                color: palette.offwhite
            },
            actions: {
                gap: spacing.m,
                alignItems: 'center',
                flexDirection: 'row',
            },
            dismiss: {
                borderWidth: 1,
                padding: spacing.s,
                borderColor: palette.offwhite,
            }
        })
    }, []);

    const dismissBanner = useCallback(() => {
        setPersonalizeState({ visible: false })
    }, [])

    const triggerPersonalization = useCallback(() => {
        router.push('/(sheets)/personalize')
    }, [])

    useEffect(() => {
        if(!user) return
        if(user.getSettings().events < 100) setPersonalizeState({ visible: true })
    }, [user]);

    if(!visible) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <View style={styling.row.m}>
                <Brush />
                <Text style={styles.title}>
                    Personalize your feed
                </Text>
            </View>

            <Text style={styles.subtitle}>
                Select you favorite genres & follow trending artists for personalized content
            </Text>

            <View style={styles.actions}>
                <Button color={'offwhite'} fill={'transparent'} label={"Dismiss"} callback={dismissBanner} />
                <Button fill={"olive"} label={"Start"} callback={triggerPersonalization} />
            </View>
        </View>
    )
}

export default FeedPersonalizationTrigger