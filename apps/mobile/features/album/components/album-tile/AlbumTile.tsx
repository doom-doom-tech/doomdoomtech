import {StyleSheet, TouchableOpacity} from 'react-native'
import {useMemo} from "react";
import AlbumContextProvider from "@/features/album/context/AlbumContextProvider";
import AlbumTileCover from "@/features/album/components/album-tile/AlbumTileCover";
import Album from "@/features/album/classes/Album";
import AlbumTitleInformation from "@/features/album/components/album-tile/AlbumTitleInformation";

interface AlbumTileProps {
    album: Album
}

const AlbumTile = ({album}: AlbumTileProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    return(
        <TouchableOpacity style={styles.wrapper} activeOpacity={0.5}>
            <AlbumContextProvider album={album}>
                <AlbumTileCover />
                <AlbumTitleInformation />
            </AlbumContextProvider>
        </TouchableOpacity>
    )
}

export default AlbumTile