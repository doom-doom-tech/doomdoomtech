import {useCallback} from "react";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import Track from "@/features/track/classes/Track";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import TrackTile from "@/features/track/components/track-tile/TrackTile";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import Block from "@/common/components/block/Block";
import useMostPopularTracks from "@/features/track/hooks/useMostPopularTracks";
import useEventListener from "@/common/hooks/useEventListener";
import {router} from "expo-router";
import Queueable from "@/common/components/Queueable";

const MostPopularTracks = () => {

    const period = useFilterStoreSelectors.period()
    const user = useFilterStoreSelectors.user()
    const subgenre = useFilterStoreSelectors.subgenre()
    const genre = useFilterStoreSelectors.genre()
    const tag = useFilterStoreSelectors.label()

    const mostPopularTracksQuery = useMostPopularTracks({
        period: period.value, genreID: genre?.getID(), subgenreID: subgenre?.getID(), labelTag: tag, userID: user?.getID()
    })

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Track>) => (
        <TrackContextProvider track={item} key={item.getID()}>
            <TrackTile />
        </TrackContextProvider>
    ), [])

    const routeAdditionalTracks = useCallback(() => {
        router.push('/list/mostPopularTracks');
    }, [])

    useEventListener('charts:refetch', mostPopularTracksQuery.refetch)

    return(
        <Queueable query={mostPopularTracksQuery}>
            <Block
                <Track>
                title={"Most popular"}
                subtitle={"View all"}
                callback={routeAdditionalTracks}
                query={mostPopularTracksQuery}
                renderItem={RenderItem}
            />
        </Queueable>
    )
}

export default MostPopularTracks