import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import Header from "@/common/components/header/Header";
import NowPlayingTile from "@/features/track/components/now-playing/NowPlayingTile";
import NowPlayingActions from "@/features/track/components/now-playing/NowPlayingActions";
import NowPlayingWaveform from "@/features/track/components/now-playing/NowPlayingWaveform";
import NowPlayingQueue from "@/features/track/components/now-playing/NowPlayingQueue";
import Scroll from "@/common/components/Scroll";
import {spacing} from "@/theme";


interface NowPlayingProps {

}

const NowPlaying = ({}: NowPlayingProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            container: {
                gap: spacing.m,
                paddingBottom: 200
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <Header title={'Now Playing'} />
            <Scroll contentContainerStyle={styles.container}>
                <NowPlayingTile />
                <NowPlayingActions />
                <NowPlayingWaveform />
                <NowPlayingQueue />
            </Scroll>
        </View>
    )
}

export default NowPlaying