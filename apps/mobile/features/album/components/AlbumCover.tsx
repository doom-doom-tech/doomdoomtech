import {StyleSheet} from 'react-native'
import {Image} from 'expo-image';
import {useMemo} from "react";
import {useAlbumContext} from "@/features/album/context/AlbumContextProvider";

interface AlbumCoverProps {
    size: number
}

const AlbumCover = ({size = 100}: AlbumCoverProps) => {

    const album = useAlbumContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                width: size,
                height: size,
            },
            media: {
                width: size,
                height: size,
                objectFit: 'cover'
            }
        })
    }, []);

    return(
        <Image
            contentFit="cover"
            source={album.getCoverSource()}
            style={styles.media} />
    )
}

export default AlbumCover