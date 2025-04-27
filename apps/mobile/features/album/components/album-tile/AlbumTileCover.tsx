import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import AlbumCover from "@/features/album/components/AlbumCover";

interface AlbumTileCoverProps {

}

const AlbumTileCover = ({}: AlbumTileCoverProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <AlbumCover size={200} />
        </View>
    )
}

export default AlbumTileCover