import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Header from "@/common/components/header/Header";
import UploadArtistsList from "@/features/upload/components/upload-artists/UploadArtistsList";
import Button from "@/common/components/buttons/Button";
import {router} from "expo-router";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";
import {spacing} from "@/theme";

interface UploadArtistsProps {

}

const UploadArtists = ({}: UploadArtistsProps) => {

    const artists = useUploadStoreSelectors.artists()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
            },
        })
    }, []);

    const handleNext = useCallback(() => {
        router.push(artists.length > 1 ? '/upload/royalties' : '/upload/boosts')
    }, [artists])

    return(
        <View style={styles.wrapper}>
            <Header title={"Artists"} />
            <UploadArtistsList />
            <Button fill={'olive'} label={"Next"} callback={handleNext}/>
        </View>
    )
}

export default UploadArtists