import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {useAlbumContext} from "@/features/album/context/AlbumContextProvider";
import {palette} from "@/theme";
import Title from "@/common/components/Title";
import Subtitle from "@/common/components/Subtitle";

interface AlbumTitleInformationProps {

}

const AlbumTitleInformation = ({}: AlbumTitleInformationProps) => {

    const album = useAlbumContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            name: {
                fontSize: 18,
                fontWeight: 800,
                color: palette.offwhite,
                textAlign: 'center'
            },
            artist: {
                fontSize: 16,
                color: palette.granite,
                textAlign: 'center'
            }
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <Title content={album.getName()} center />
            <Subtitle content={album.getArtist().username} center />
        </View>
    )
}

export default AlbumTitleInformation