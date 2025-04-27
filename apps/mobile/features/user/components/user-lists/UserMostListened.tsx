import {StyleSheet, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import Block from "@/common/components/block/Block";
import useSingleUserContext from "@/features/user/hooks/useSingleUserContext";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import Track from "@/features/track/classes/Track";
import TrackTile from "@/features/track/components/track-tile/TrackTile";
import {extractItemsFromInfinityQuery} from "@/common/services/utilities";
import useMostListenedTracks from "@/features/track/hooks/useMostListenedTracks";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";

interface UserBestRatedProps {

}

const UserBestRated = ({}: UserBestRatedProps) => {

    const period = useFilterStoreSelectors.period()

    const user = useSingleUserContext()

    const mostListenedTracksQuery = useMostListenedTracks({
        period: period,
        userID: user.getID()
    })
    
    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const routeAdditionalTracks = useCallback(() => {

    }, [])

    const RenderItem = useCallback(({item}: ListRenderItemPropsInterface<Track>) => (
        <TrackContextProvider track={item} key={item.getID()}>
            <TrackTile size={150} />
        </TrackContextProvider>
    ), [])

    if(mostListenedTracksQuery.isLoading || mostListenedTracksQuery.isError || !extractItemsFromInfinityQuery(mostListenedTracksQuery.data).length) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <Block
                <Track>
                title={"Most listened"}
                subtitle={"View all"}
                callback={routeAdditionalTracks}
                query={mostListenedTracksQuery}
                renderItem={RenderItem}
            />
        </View>
    )
}

export default UserBestRated