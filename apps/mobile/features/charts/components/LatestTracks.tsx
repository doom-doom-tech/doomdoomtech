import {useCallback} from "react";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import useLatestTracks from "@/features/track/hooks/useLatestTracks";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import Track from "@/features/track/classes/Track";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import TrackTile from "@/features/track/components/track-tile/TrackTile";
import {router} from "expo-router";
import useEventListener from "@/common/hooks/useEventListener";
import Block from "@/common/components/block/Block";
import Queueable from "@/common/components/Queueable";

interface LatestTracksProps {

}

const LatestTracks = ({}: LatestTracksProps) => {

    const user = useFilterStoreSelectors.user()
    const period = useFilterStoreSelectors.period()
    const subgenre = useFilterStoreSelectors.subgenre()
    const genre = useFilterStoreSelectors.genre()
    const tag = useFilterStoreSelectors.label()

    const latestTracksQuery = useLatestTracks({
        period: period.value, genreID: genre?.getID(), subgenreID: subgenre?.getID(), labelTag: tag, userID: user?.getID()
    })

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Track>) => (
        <TrackContextProvider track={item} key={item.getID()}>
            <TrackTile />
        </TrackContextProvider>
    ), [])

    const routeAdditionalTracks = useCallback(() => {
        router.push('/list/bestRatedTracks')
    }, [])

    useEventListener('charts:refetch', latestTracksQuery.refetch)

    return(
        <Queueable query={latestTracksQuery}>
            <Block
                <Track>
                title={"Latest releases"}
                subtitle={"View all"}
                callback={routeAdditionalTracks}
                query={latestTracksQuery}
                renderItem={RenderItem}
            />
        </Queueable>
    )
}

export default LatestTracks