import {StyleSheet, View} from 'react-native'
import {Fragment, useCallback, useMemo} from "react";
import Block from "@/common/components/block/Block";
import useSingleUserContext from "@/features/user/hooks/useSingleUserContext";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import Track from "@/features/track/classes/Track";
import TrackTile from "@/features/track/components/track-tile/TrackTile";
import {extractItemsFromInfinityQuery} from "@/common/services/utilities";
import useMostPopularTracks from "@/features/track/hooks/useMostPopularTracks";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";

interface UserBestRatedProps {

}

const UserBestRated = ({}: UserBestRatedProps) => {

    const period = useFilterStoreSelectors.period()

    const user = useSingleUserContext()

    const bestRatedTracksQuery = useMostPopularTracks({
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

    if(bestRatedTracksQuery.isLoading || bestRatedTracksQuery.isError || !extractItemsFromInfinityQuery(bestRatedTracksQuery.data).length) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <Block
                <Track>
                title={"Most popular"}
                subtitle={"View all"}
                callback={routeAdditionalTracks}
                query={bestRatedTracksQuery}
                renderItem={RenderItem}
            />
        </View>
    )
}

export default UserBestRated