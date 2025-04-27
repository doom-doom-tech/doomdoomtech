import {Fragment, useCallback} from "react";
import useUserTopPicks from "@/features/user/hooks/useUserTopPicks";
import Block from "@/common/components/block/Block";
import Track from "@/features/track/classes/Track";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import TrackTile from "@/features/track/components/track-tile/TrackTile";
import useSingleUserContext from "@/features/user/hooks/useSingleUserContext";
import {router} from "expo-router";
import Queueable from "@/common/components/Queueable";

interface UserTopPicksProps {

}

const UserTopPicks = ({}: UserTopPicksProps) => {

    const user = useSingleUserContext()

    const userTopPicksQuery = useUserTopPicks({ userID: user.getID() })

    const RenderItem = useCallback(({item}: ListRenderItemPropsInterface<Track>) => (
        <TrackContextProvider track={item} key={item.getID()}>
            <TrackTile size={150} />
        </TrackContextProvider>
    ), [])

    const routeAdditionalTracks = useCallback(() => {
        router.push('/list')
    }, [])

    if(userTopPicksQuery.isLoading || userTopPicksQuery.isError || !userTopPicksQuery.data?.length) return <Fragment />

    return(
        <Queueable query={userTopPicksQuery}>
            <Block
                <Track>
                title={`${user.getUsername()}'s Top picks`}
                subtitle={"View all"}
                callback={routeAdditionalTracks}
                query={userTopPicksQuery}
                renderItem={RenderItem}
            />
        </Queueable>
    )
}

export default UserTopPicks