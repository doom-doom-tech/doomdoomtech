import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import UploadGenreOverview from "@/features/upload/components/upload-genres/UploadGenreOverview";
import Header from "@/common/components/header/Header";
import Button from "@/common/components/buttons/Button";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";
import {router} from "expo-router";
import {spacing} from "@/theme";
import UploadDescription from "@/features/upload/components/UploadDescription";

interface UploadGenresProps {

}

const UploadGenres = ({}: UploadGenresProps) => {

    const genre = useUploadStoreSelectors.genre()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'relative',
                gap: spacing.m
            },
        })
    }, []);

    const nextVisible = useMemo(() => {
        return Boolean(genre)
    }, [genre])

    const handleNext = useCallback(() => {
        router.push('/upload/artists')
    }, [])


    return(
        <View style={styles.wrapper}>
            <Header title={"Select a genre"} />
            <UploadDescription
                description={"Select the genre that best represents your track."}
            />
            <UploadGenreOverview />
            <Button disabled={!nextVisible} fill={'olive'} label={"Next"} callback={handleNext} />
        </View>
    )
}

export default UploadGenres