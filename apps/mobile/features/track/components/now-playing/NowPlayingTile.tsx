import {StyleSheet, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import {useMediaStoreSelectors} from "@/common/store/media";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import TrackCover from "@/features/track/components/TrackCover";
import TrackTileInformation from "@/features/track/components/track-tile/TrackTileInformation";
import NowPlayingRate from "@/features/track/components/now-playing/NowPlayingRate";

interface NowPlayingTileProps {

}

const NowPlayingTile = ({}: NowPlayingTileProps) => {

    const currentTrack = useMediaStoreSelectors.current()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                width: 200,
                alignSelf: 'center',
                alignItems: 'center',
                position: 'relative',
                justifyContent: 'center',
            },
        })
    }, []);

    const handleCompleteRating = useCallback(() => {

    }, [])

    if(!currentTrack) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <TrackContextProvider track={currentTrack}>
                <TrackCover size={200} />
                <TrackTileInformation center />
                <NowPlayingRate />
            </TrackContextProvider>
        </View>
    )
}

export default NowPlayingTile