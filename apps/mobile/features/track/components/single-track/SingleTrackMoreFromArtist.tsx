import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import useLatestTracks from "@/features/track/hooks/useLatestTracks";
import TrackContextProvider, {useTrackContext} from "@/features/track/context/TrackContextProvider";
import Block from "@/common/components/block/Block";
import Track from "@/features/track/classes/Track";
import Queueable from "@/common/components/Queueable";
import {useCallback} from "react";
import {router} from "expo-router";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import TrackTile from "@/features/track/components/track-tile/TrackTile";
import _ from "lodash";

const SingleTrackMoreFromArtist = () => {

    const track = useTrackContext()

    const user = useFilterStoreSelectors.user()
    const period = useFilterStoreSelectors.period()
    const subgenre = useFilterStoreSelectors.subgenre()
    const genre = useFilterStoreSelectors.genre()
    const tag = useFilterStoreSelectors.label()

    const latestTracksQuery = useLatestTracks({
        period: period.value, genreID: genre?.getID(), subgenreID: subgenre?.getID(), labelTag: tag, userID: track.getMainArtist().getID()
    })

    const handleRouteArtist = useCallback(() => {
        router.push(`/user/${track.getMainArtist().getID()}`)
    }, [])

    const RenderItem = useCallback(({item}: ListRenderItemPropsInterface<Track>) => (
        <TrackContextProvider track={item} key={item.getID()}>
            <TrackTile />
        </TrackContextProvider>
    ), [])

    return(
        <Queueable query={latestTracksQuery}>
            <Block
                <Track>
                title={`More from ${track.getMainArtist().getUsername()}`}
                subtitle={""}
                callback={_.noop}
                query={latestTracksQuery}
                renderItem={RenderItem}
            />
        </Queueable>
    )
}

export default SingleTrackMoreFromArtist