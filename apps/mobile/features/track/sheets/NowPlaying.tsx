import {StyleSheet, useWindowDimensions, View} from 'react-native'
import React, {Fragment, useCallback, useMemo, useRef} from "react";
import BottomSheet, {BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {palette, spacing} from "@/theme";
import useEventListener from "@/common/hooks/useEventListener";
import {useTrackStoreSelectors} from "@/features/track/store/track";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import useCurrentTrack from '../hooks/useCurrentTrack';

import NowPlayingMedia from '../components/now-playing/NowPlayingMedia';
import NowPlayingInformation from '../components/now-playing/NowPlayingInformation';
import NowPlayingActions from '../components/now-playing/NowPlayingActions';
import NowPlayingHeader from '../components/now-playing/NowPlayingHeader';
import NowPlayingWaveform from '../components/now-playing/NowPlayingWaveform';
import NowPlayingRate from '../components/now-playing/NowPlayingRate';
import NowPlayingMetrics from '../components/now-playing/NowPlayingMetrics';
import NowPlayingQueue from '../components/now-playing/NowPlayingQueue';
import {useSharedValue} from 'react-native-reanimated';

const NowPlayingSheet = () => {

    const track = useTrackStoreSelectors.track()

    const { height } = useWindowDimensions()
    const bottomSheetRef = useRef<BottomSheet>(null);

    const current = useCurrentTrack()

    const scrollOffset = useSharedValue(0);

    // Define snap points as a memoized value
    const snapPoints = useMemo(() => [800], [height]);

    const handleSheetChanges = useCallback((index: number) => {
            console.log(index);
            
    }, []);

    const styles = StyleSheet.create({
        wrapper: {
            borderRadius: 25
        },
        contentContainer: {
            borderRadius: 25,
            gap: spacing.m,
            paddingBottom: 400,
            width: '100%',
            overflow: 'hidden',
            backgroundColor: palette.black
        },
    })

    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
            {...props}
            style={{
                backgroundColor: track ? palette.black : palette.transparent,
            }}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
        />
    ), []);

    const sheetEventListener = useCallback(({ name }: { name: string }) => {
        if (name === 'NowPlaying') {            
            bottomSheetRef.current?.snapToIndex(0);
        }
    }, []);

    const sheetCloseListener = useCallback(({ name }: { name: string }) => {
        if(name === 'NowPlaying') {
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
            index={-1}
            backdropComponent={renderBackdrop}
            handleComponent={() => <Fragment/>}
            onChange={handleSheetChanges}>
                <BottomSheetScrollView contentContainerStyle={styles.contentContainer}> 
                    <View>
                        { current && (
                            <TrackContextProvider track={current}>
                                <NowPlayingMedia scrollOffset={scrollOffset} />
                                <NowPlayingInformation />
                                <NowPlayingWaveform />
                                <NowPlayingActions />
                                <NowPlayingRate />
                                <NowPlayingMetrics />
                                <NowPlayingQueue />
                            </TrackContextProvider>
                        )}                  

                        { current && (
                            <TrackContextProvider track={current}>
                                <NowPlayingHeader />
                            </TrackContextProvider>
                        )}          
                    </View>
                </BottomSheetScrollView>
        </BottomSheet>
    )
}

export default NowPlayingSheet
