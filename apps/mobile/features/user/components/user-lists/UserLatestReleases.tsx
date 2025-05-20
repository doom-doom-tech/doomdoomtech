import {useCallback} from "react";
import Block from "@/common/components/block/Block";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import Track from "@/features/track/classes/Track";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import TrackTile from "@/features/track/components/track-tile/TrackTile";
import useSingleUserContext from "@/features/user/hooks/useSingleUserContext";
import useLatestTracks from "@/features/track/hooks/useLatestTracks";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import Queueable from "@/common/components/Queueable";
import {router} from "expo-router";

interface UserLatestReleasesProps {

}

const UserLatestReleases = ({}: UserLatestReleasesProps) => {

    const user = useSingleUserContext()

    const period = useFilterStoreSelectors.period()

    const userTracksQuery = useLatestTracks({
        userID: user.getID(),
        period : period.value
    })

    const routeAdditionalTracks = useCallback(() => {
        router.push('/list/latestReleases')
    }, [])

    const RenderItem = useCallback(({item}: ListRenderItemPropsInterface<Track>) => (
        <TrackContextProvider track={item} key={item.getID()}>
            <TrackTile size={150} />
        </TrackContextProvider>
    ), [])

    return(
        <Queueable query={userTracksQuery}>
            <Block
                <Track>
                infinite
                query={userTracksQuery}
                title={"Latest releases"}
                subtitle={"View all"}
                callback={routeAdditionalTracks}
                renderItem={RenderItem}
            />
        </Queueable>
    )
}

export default UserLatestReleases