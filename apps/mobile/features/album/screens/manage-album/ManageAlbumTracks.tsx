import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Header from "@/common/components/header/Header";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import TrackRow from "@/features/track/components/track-row/TrackRow";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import Track from "@/features/track/classes/Track";
import useLatestTracks from "@/features/track/hooks/useLatestTracks";
import {useManageAlbumStoreSelectors} from "@/features/album/store/manage-album";
import _ from "lodash";

interface ManageAlbumTracksProps {

}

const ManageAlbumTracks = ({}: ManageAlbumTracksProps) => {

    const user = useGlobalUserContext()

    const tracks = useManageAlbumStoreSelectors.tracks()
    const setManageAlbumState = useManageAlbumStoreSelectors.setState()

    const userTracksQuery = useLatestTracks({
        userID: user!.getID(),
        period: 'infinite'
    })

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const selected = useCallback((t: Track) => {
        return tracks.some(track => track.getID() === t.getID())
    }, [tracks])

    const handleSelectTrack = useCallback((t: Track) => {
        if(selected(t)) return setManageAlbumState({ tracks: _.reject(tracks, track => track.getID() === t.getID()) })
        setManageAlbumState({ tracks: [...tracks, t] })
    }, [selected, tracks])

    const RenderItem = useCallback(({item, index}: ListRenderItemPropsInterface<Track>) => (
        <TrackContextProvider track={item} key={item.getID()}>
            <TrackRow type={'no-action'} selectable onSelect={handleSelectTrack} selected={selected(item)} />
        </TrackContextProvider>
    ), [selected, handleSelectTrack])

    return(
        <View style={styles.wrapper}>
            <Header title="Select tracks" />
            <List infinite renderItem={RenderItem} query={userTracksQuery} />
        </View>
    )
}

export default ManageAlbumTracks