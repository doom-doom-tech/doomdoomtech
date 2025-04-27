import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {LinearGradient} from "expo-linear-gradient";
import Button from "@/common/components/buttons/Button";
import {router} from "expo-router";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";

interface UploadGenreOverlayProps {

}

const UploadGenreOverlay = ({}: UploadGenreOverlayProps) => {

    const genre = useUploadStoreSelectors.genre()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'absolute',
                bottom: 80,
                height: 400,
                width: '100%'
            },
            content: {
                height: 400,
                width: '100%',
                position: 'relative',
                justifyContent: 'center'
            },
            overlay: {
                position: 'absolute',
                bottom: 0,
                height: 400,
                width: '100%',
                pointerEvents: 'none'
            },
            button: {
                height: 50,
            }
        })
    }, []);

    const handleNext = useCallback(() => {
        router.push('/upload/artists')
    }, [])

    const nextVisible = useMemo(() => {
        return Boolean(genre)
    }, [genre])

    return(
        <View style={styles.wrapper}>
            <View style={styles.content}>
                <LinearGradient colors={['#00000000', '#000000']} style={styles.overlay} />
                <View style={styles.button}>
                    <Button disabled={!nextVisible} fill={'olive'} label={"Next"} callback={handleNext} />
                </View>
            </View>
        </View>
    )
}

export default UploadGenreOverlay