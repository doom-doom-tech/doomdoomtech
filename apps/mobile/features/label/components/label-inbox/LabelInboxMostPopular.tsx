import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Track from "@/features/track/classes/Track";
import Block from "@/common/components/block/Block";
import {useLocalSearchParams} from "expo-router";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import TrackTile from "@/features/track/components/track-tile/TrackTile";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import useMostPopularTracks from "@/features/track/hooks/useMostPopularTracks";

interface LabelInboxBestRatedProps {

}

const LabelInboxBestRated = ({}: LabelInboxBestRatedProps) => {

    const period = useFilterStoreSelectors.period()

    const {tag} = useLocalSearchParams()

    const mostPopularQuery = useMostPopularTracks({
        period: period,
        labelTag: tag as string
    })

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Track>) => (
        <TrackContextProvider track={item}>
            <TrackTile />
        </TrackContextProvider>
    ), [])

    const routeAdditionalTracks = useCallback(() => {
        // TODO
    }, [])

    return(
        <View style={styles.wrapper}>
            <Block
                <Track>
                title={"Most popular"}
                subtitle={"View all"}
                callback={routeAdditionalTracks}
                query={mostPopularQuery}
                renderItem={RenderItem}
            />
        </View>
    )
}

export default LabelInboxBestRated