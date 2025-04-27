import {StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native'
import React, {Fragment, useCallback, useMemo, useRef} from "react";
import BottomSheet, {BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView} from "@gorhom/bottom-sheet";
import {palette, spacing} from "@/theme";
import useEventListener from "@/common/hooks/useEventListener";
import Close from "@/assets/icons/Close";
import SingleTrackActions from "@/features/track/components/single-track/SingleTrackActions";

interface TrackOptionsProps {

}

const TrackOptions = ({}: TrackOptionsProps) => {

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
                paddingHorizontal: spacing.m,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
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
                top: spacing.s,
                right: spacing.m,
                padding: spacing.m,
                borderRadius: 400,
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
        if(name === 'TrackOptions') {
            bottomSheetRef.current?.snapToIndex(0)
        }
    }, [])

    const sheetCloseListener = useCallback(({ name }: { name: string }) => {
        if(name === 'TrackOptions') {
            bottomSheetRef.current?.close()
        }
    }, [])

    useEventListener('sheet:expand', sheetEventListener)
    useEventListener('sheet:close', sheetCloseListener)

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
                <TouchableOpacity style={styles.close} onPress={handleCloseSheet}>
                    <Close color={palette.offwhite} />
                </TouchableOpacity>
                <SingleTrackActions />
            </BottomSheetView>
        </BottomSheet>
    );
}

export default TrackOptions