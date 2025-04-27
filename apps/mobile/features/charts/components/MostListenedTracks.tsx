import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo, useRef} from "react";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import Track from "@/features/track/classes/Track";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import TrackTile from "@/features/track/components/track-tile/TrackTile";
import {useFilterStoreSelectors} from "@/features/filter/store/filter";
import Block from "@/common/components/block/Block";
import useMostListenedTracks from "@/features/track/hooks/useMostListenedTracks";
import useEventListener from "@/common/hooks/useEventListener";
import {router} from "expo-router";
import * as Crypto from "expo-crypto";
import useMediaActions from "@/common/hooks/useMediaActions";
import Queueable from "@/common/components/Queueable";

interface BestRatedTracksProps {

}

const BestRatedTracks = ({}: BestRatedTracksProps) => {

    const period = useFilterStoreSelectors.period()
    const user = useFilterStoreSelectors.user()
    const subgenre = useFilterStoreSelectors.subgenre()
    const genre = useFilterStoreSelectors.genre()
    const tag = useFilterStoreSelectors.label()

    const { current: listUUID} = useRef(Crypto.randomUUID())

    const { fillQueue } = useMediaActions()

    const mostListenedQuery = useMostListenedTracks({
        period: period.value, genreID: genre?.getID(), subgenreID: subgenre?.getID(), labelTag: tag, userID: user?.getID()
    })

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Track>) => (
        <TrackContextProvider track={item}>
            <TrackTile />
        </TrackContextProvider>
    ), [])

    const routeAdditionalTracks = useCallback(() => {
        router.push('/list/mostListenedTracks')
    }, [])

    useEventListener('charts:refetch', mostListenedQuery.refetch)

    return(
        <Queueable query={mostListenedQuery}>
            <View style={styles.wrapper}>
                <Block
                    <Track>
                    title={"Most listened"}
                    subtitle={"View all"}
                    callback={routeAdditionalTracks}
                    query={mostListenedQuery}
                    renderItem={RenderItem}
                />
            </View>
        </Queueable>
    )
}

export default BestRatedTracks