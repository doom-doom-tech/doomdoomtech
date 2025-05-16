import {StyleSheet, useWindowDimensions} from 'react-native'
import React, {Fragment, useCallback, useMemo, useRef} from "react";
import BottomSheet, {BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView} from "@gorhom/bottom-sheet";
import {palette, spacing} from "@/theme";
import useEventListener from "@/common/hooks/useEventListener";
import TrackOptionsItems from "@/features/track/components/track-options/TrackOptionsItems";
import {useTrackStoreSelectors} from "@/features/track/store/track";
import TrackOptionsHeader from "@/features/track/components/track-options/TrackOptionsHeader";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import {useFocusEffect} from "expo-router"

const TrackOptions = () => {

    const track = useTrackStoreSelectors.track()

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
                padding: spacing.s,
                borderRadius: 400,
                backgroundColor: palette.granite
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

    const sheetEventListener = useCallback(({ name }: { name: string }) => {
        // Only respond to the event if it's not the initial mount
        if (name === 'TrackOptions') {
            bottomSheetRef.current?.snapToIndex(0);
        }
    }, []);

    const sheetCloseListener = useCallback(({ name }: { name: string }) => {
        if(name === 'TrackOptions') {
            bottomSheetRef.current?.close()
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            bottomSheetRef.current?.snapToIndex(-1);

            return () => {
                bottomSheetRef.current?.close();
            };
        }, [])
    );


    useEventListener('sheet:expand', sheetEventListener)
    useEventListener('sheet:close', sheetCloseListener)

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
                { track && (
                    <TrackContextProvider track={track}>
                        <TrackOptionsHeader />
                        <TrackOptionsItems track={track} />
                    </TrackContextProvider>
                )}
            </BottomSheetView>
        </BottomSheet>
    )
}

export default TrackOptions
