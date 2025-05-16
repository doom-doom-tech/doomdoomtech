import {StyleSheet, View} from 'react-native';
import Scroll from '@/common/components/Scroll';
import NowPlayingMedia from '@/features/track/components/now-playing/NowPlayingMedia';
import TrackContextProvider from '@/features/track/context/TrackContextProvider';
import NowPlayingHeader from '@/features/track/components/now-playing/NowPlayingHeader';
import NowPlayingInformation from '@/features/track/components/now-playing/NowPlayingInformation';
import {spacing} from '@/theme';
import NowPlayingActions from '../components/now-playing/NowPlayingActions';
import NowPlayingRate from '@/features/track/components/now-playing/NowPlayingRate';
import NowPlayingMetrics from '@/features/track/components/now-playing/NowPlayingMetrics';
import NowPlayingQueue from '../components/now-playing/NowPlayingQueue';
import {useAnimatedScrollHandler, useSharedValue} from 'react-native-reanimated';
import useCurrentTrack from "@/features/track/hooks/useCurrentTrack";
import NowPlayingWaveform from "@/features/track/components/now-playing/NowPlayingWaveform";

interface NowPlayingProps {}

const NowPlaying = ({}: NowPlayingProps) => {

    const current = useCurrentTrack()

    const scrollOffset = useSharedValue(0);

    const styles = StyleSheet.create({
        container: {
            gap: spacing.m,
            paddingBottom: 200,
        },
    });

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollOffset.value = event.contentOffset.y;
        },
    });

    if (!current) return <View />;

    return (
        <TrackContextProvider track={current}>
            <Scroll contentContainerStyle={styles.container} onScroll={scrollHandler}>
                <NowPlayingMedia scrollOffset={scrollOffset} />
                <NowPlayingInformation />
                <NowPlayingWaveform />
                <NowPlayingActions />
                <NowPlayingRate />
                <NowPlayingMetrics />
                <NowPlayingQueue />
            </Scroll>
            <View style={{ position: 'absolute', top: 0, width: '100%' }}>
                <NowPlayingHeader />
            </View>
        </TrackContextProvider>
    );
};

export default NowPlaying;