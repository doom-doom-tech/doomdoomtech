import {useCallback} from "react";
import Block from "@/common/components/block/Block";
import {router} from "expo-router";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import Track from "@/features/track/classes/Track";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import TrackVideoTile from "@/features/track/components/track-video-tile/TrackVideoTile";
import useLatestVideos from "@/features/track/hooks/useLatestVideos";
import Queueable from "@/common/components/Queueable";

const LatestVideos = () => {

    const user = useFilterStoreSelectors.user()
    const period = useFilterStoreSelectors.period()
    const subgenre = useFilterStoreSelectors.subgenre()
    const genre = useFilterStoreSelectors.genre()
    const tag = useFilterStoreSelectors.label()

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