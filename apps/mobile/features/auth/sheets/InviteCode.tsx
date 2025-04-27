import {StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native'
import React, {Fragment, useCallback, useMemo, useRef} from "react";
import BottomSheet, {BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView} from '@gorhom/bottom-sheet';
import {palette, spacing} from "@/theme";
import Background from "@/assets/images/invitecode.png"
import {ImageBackground} from "expo-image";
import Close from "@/assets/icons/Close";
import useEventListener from "@/common/hooks/useEventListener";
import Text from "@/common/components/Text";
import * as Clipboard from "expo-clipboard";
import {TOASTCONFIG} from "@/common/constants";
import Toast from "react-native-root-toast";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";

const InviteCode = () => {

    const user = useGlobalUserContext()

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
                padding: 16,
                paddingBottom: 50,
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
                fontSize: 16,
                textAlign: 'center',
                color: palette.granite
            },
            span: {
                fontSize: 16,
                color: palette.gold
            },
            close: {
                position: "absolute",
                top: spacing.m,
                right: spacing.m,
                padding: spacing.m,
                borderRadius: 400,
                backgroundColor: palette.darkgrey
            },
            codeWrapper: {
                flexDirection: 'row',
                padding: spacing.l,
                backgroundColor: palette.grey
            },
            codeSpan: {
                color: palette.offwhite
            },
            code: {
                fontSize: 18,
                color: palette.offwhite + '80'
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
        if(name === 'InviteCode') {
            bottomSheetRef.current?.snapToIndex(0)
        }
    }, [])

    const handleCopyCode = useCallback(async () => {
        if(!user) return
        await Clipboard.setStringAsync(`https://doomdoom.tech/i/${user.getInviteCode().code}`)
        Toast.show('Copied to clipboard!', TOASTCONFIG.success)
    }, [user])

    useEventListener('sheet:expand', sheetEventListener)

    if(!user) return <></>

    return (
        <BottomSheet
            backgroundStyle={styles.wrapper}
            snapPoints={snapPoints}
            enablePanDownToClose
            ref={bottomSheetRef}
            index={-1}
            backdropComponent={renderBackdrop}
            handleComponent={() => <Fragment/>}
            onChange={handleSheetChanges}>
            <BottomSheetView style={styles.contentContainer}>
                <ImageBackground source={Background} style={{
                    ...StyleSheet.absoluteFillObject,
                    opacity: 0.5
                }}/>

                <TouchableOpacity style={styles.close} onPress={handleCloseSheet}>
                    <Close color={palette.offwhite} />
                </TouchableOpacity>

                <Text style={styles.title}>
                    Invite a friend
                </Text>
                <Text style={styles.subtitle}>
                    Music is better enjoyed together—invite a friend via your invite link.
                </Text>

                <TouchableOpacity style={styles.codeWrapper} onPress={handleCopyCode}>
                    <Text style={styles.code}>
                        doomdoom.tech/i/ <Text style={styles.codeSpan}>{user.getInviteCode().code}</Text>
                    </Text>
                </TouchableOpacity>

                <Text style={styles.subtitle}>
                    Used: {user.getInviteCode().usages} / 5 times
                </Text>

                <Text style={styles.subtitle}>
                    When they create an account you receive a <Text style={styles.span}>1 credit bonus</Text>.
                </Text>
            </BottomSheetView>
        </BottomSheet>
    );
}

export default InviteCode