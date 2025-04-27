import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {useSearchStoreSelectors} from "@/features/search/store/search";
import useSearchTracks from "@/features/search/hooks/useSearchTracks";
import {ListRenderItemPropsInterface} from "@/common/components/List";
import Track from "@/features/track/classes/Track";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import TrackTile from "@/features/track/components/track-tile/TrackTile";
import Block from "@/common/components/block/Block";

interface SearchTrackResultsProps {

}

const SearchTrackResults = ({}: SearchTrackResultsProps) => {

    const query = useSearchStoreSelectors.query()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const searchTracksQuery = useSearchTracks(query)

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Track>) => (
        <TrackContextProvider track={item}>
            <TrackTile />
        </TrackContextProvider>
    ), [])

    const routeAdditionalTracks = useCallback(() => {
        // TODO
    }, [])

    return(
        <View style={styles.wrapper}>
            <Block
                <Track>
                title={"Tracks"}
                subtitle={"View all"}
                callback={routeAdditionalTracks}
                query={searchTracksQuery}
                renderItem={RenderItem}
            />
        </View>
    )
}

export default SearchTrackResults