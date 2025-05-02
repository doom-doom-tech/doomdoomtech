import {useCallback} from "react";
import useBestRatedTracks from "@/features/track/hooks/useBestRatedTracks";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import Track from "@/features/track/classes/Track";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import TrackTile from "@/features/track/components/track-tile/TrackTile";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import Block from "@/common/components/block/Block";
import useEventListener from "@/common/hooks/useEventListener";
import {router} from "expo-router";
import Queueable from "@/common/components/Queueable";

const BestRatedTracks = () => {

    const user = useFilterStoreSelectors.user()
    const period = useFilterStoreSelectors.period()
    const subgenre = useFilterStoreSelectors.subgenre()
    const genre = useFilterStoreSelectors.genre()
    const tag = useFilterStoreSelectors.label()

    const bestRatedTracksQuery = useBestRatedTracks({
        period: period.value, genreID: genre?.getID(), subgenreID: subgenre?.getID(), labelTag: tag, userID: user?.getID()
    })

    const RenderItem = useCallback(({item}: ListRenderItemPropsInterface<Track>) => (
        <TrackContextProvider track={item} key={item.getID()}>
            <TrackTile />
        </TrackContextProvider>
    ), [])

    const routeAdditionalTracks = useCallback(() => {
        router.push('/list/bestRatedTracks')
    }, [])

    useEventListener('charts:refetch', bestRatedTracksQuery.refetch)

    return(
        <Queueable query={bestRatedTracksQuery}>
            <Block
                <Track>
                windowSize={3}
                title={"Best rated"}
                subtitle={"View all"}
                initialNumToRender={3}
                renderItem={RenderItem}
                maxToRenderPerBatch={3}
                query={bestRatedTracksQuery}
                callback={routeAdditionalTracks}
                keyExtractor={(item) => String(item.getID())}
            />
        </Queueable>
    )
}

export default BestRatedTracks