import {StyleSheet, TouchableOpacity} from 'react-native'
import React, {Fragment, useCallback, useMemo, useRef} from "react";
import BottomSheet, {BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView} from "@gorhom/bottom-sheet";
import {ImageBackground} from "expo-image";
import Close from "@/assets/icons/Close";
import {palette, spacing} from "@/theme";
import {WithChildren} from "@/common/types/common";
import useEventListener from "@/common/hooks/useEventListener";

interface SheetProps extends WithChildren {
    name: string
    background?: string
    snapPoints: Array<number>
}

const Sheet = ({name, background, snapPoints, children}: SheetProps) => {

    const bottomSheetRef = useRef<BottomSheet>(null);

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
                justifyContent: 'flex-end',
                alignItems: 'center',
            },
            close: {
                position: "absolute",
                top: 50,
                right: spacing.m,
                padding: spacing.s,
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

    const handleSheetChanges = useCallback((index: number) => {}, []);

    const sheetEventListener = useCallback((props: { name: string }) => {
        if(name === props.name) {
            bottomSheetRef.current?.snapToIndex(0)
        }
    }, [])

    useEventListener('sheet:expand', sheetEventListener)

    return(
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
                <ImageBackground source={background} style={StyleSheet.absoluteFillObject}/>

                <TouchableOpacity style={styles.close} onPress={handleCloseSheet}>
                    <Close color={palette.offwhite} />
                </TouchableOpacity>

                {children}
            </BottomSheetView>
        </BottomSheet>
    )
}

export default Sheet