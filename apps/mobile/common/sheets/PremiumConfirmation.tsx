import {StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native'
import React, {Fragment, useCallback, useMemo, useRef} from "react";
import BottomSheet, {BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView} from '@gorhom/bottom-sheet';
import {palette, spacing} from "@/theme";
import Text from "@/common/components/Text";
import SubscriptionConfirmation from "@/assets/images/subscription-confirmation.png"
import {ImageBackground} from "expo-image";
import PremiumBadge from "@/assets/icons/PremiumBadge";
import Close from "@/assets/icons/Close";
import useEventListener from "@/common/hooks/useEventListener";

const PremiumConfirmation = () => {

    const { height } = useWindowDimensions()
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Define snap points as a memoized value
    const snapPoints = useMemo(() => [height / 1.5], [height]);

    const handleSheetChanges = useCallback((index: number) => {
    }, []);

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                backgroundColor: palette.black,
                borderRadius: 25,
            },
            contentContainer: {
                flex: 1,
                borderRadius: 25,
                overflow: 'hidden',
                gap: spacing.m,
                backgroundColor: palette.black,
                padding: 50,
                justifyContent: 'flex-end',
                alignItems: 'center',
            },
            title: {
                fontSize: 30,
                textAlign: 'center',
                color: palette.offwhite,
                fontWeight: 900
            },
            subtitle: {
                fontSize: 24,
                textAlign: 'center',
                color: palette.granite
            },
            span: {
                fontSize: 24,
                color: palette.gold
            },
            close: {
                position: "absolute",
                top: spacing.m,
                right: spacing.m,
                padding: spacing.m,
                borderRadius: 400,
                backgroundColor: palette.darkgrey
            }
        })
    }, []);

    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
        />
    ), []);

    const handleCloseSheet = useCallback(() => {
        bottomSheetRef.current?.close()
    }, [])

    const sheetEventListener = useCallback(({ name }: { name: string }) => {
        if(name === 'PaymentConfirmation') {
            bottomSheetRef.current?.snapToIndex(0)
        }
    }, [])

    useEventListener('sheet:expand', sheetEventListener)

    return (
        <BottomSheet
            backgroundStyle={styles.wrapper}
            snapPoints={snapPoints}
            enablePanDownToClose
            ref={bottomSheetRef}
            index={-1} // Start closed
            backdropComponent={renderBackdrop}
            handleComponent={() => <Fragment/>}
            onChange={handleSheetChanges}>
            <BottomSheetView style={styles.contentContainer}>
                <ImageBackground source={SubscriptionConfirmation} style={StyleSheet.absoluteFillObject}/>

                <TouchableOpacity style={styles.close} onPress={handleCloseSheet}>
                    <Close color={palette.offwhite} />
                </TouchableOpacity>

                <PremiumBadge/>
                <Text style={styles.title}>
                    Thanks for subscribing
                </Text>
                <Text style={styles.subtitle}>
                    You are now a <Text style={styles.span}>premium</Text> member.
                </Text>
            </BottomSheetView>
        </BottomSheet>
    );
}

export default PremiumConfirmation