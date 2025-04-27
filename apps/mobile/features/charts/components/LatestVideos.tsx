import { View, StyleSheet } from 'react-native'
import {useCallback, useEffect, useMemo} from "react";
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import Note from "@/features/note/classes/Note";
import Block from "@/common/components/block/Block";
import {router} from "expo-router";
import useLatestTracks from "@/features/track/hooks/useLatestTracks";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import Track from "@/features/track/classes/Track";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import period from "@/app/(sheets)/filters/period";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import TrackVideoTile from "@/features/track/components/track-video-tile/TrackVideoTile";
import useLatestVideos from "@/features/track/hooks/useLatestVideos";
import {extractItemsFromInfinityQuery} from "@/common/services/utilities";
import Queueable from "@/common/components/Queueable";

interface NewVideosProps {

}

const LatestVideos = ({}: NewVideosProps) => {

    const user = useFilterStoreSelectors.user()
    const period = useFilterStoreSelectors.period()
    const subgenre = useFilterStoreSelectors.subgenre()
    const genre = useFilterStoreSelectors.genre()
    const tag = useFilterStoreSelectors.label()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const latestVideosQuery = useLatestVideos({
        period: period.value, genreID: genre?.getID(), subgenreID: subgenre?.getID(), labelTag: tag, userID: user?.getID()
    })

    const routeVerticalList = useCallback(() => {
        router.push('/list/latestVideos');
    }, [])

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Track>) => (
        <TrackContextProvider track={item} key={index}>
            <TrackVideoTile size={250} />
        </TrackContextProvider>
    ), [])

    return(
        <Queueable query={latestVideosQuery}>
            <Block
                <Track>
                title={"Latest videos"}
                subtitle={"View all"}
                callback={routeVerticalList}
                query={latestVideosQuery}
                renderItem={RenderItem}
            />
        </Queueable>
    )
}

export default LatestVideos