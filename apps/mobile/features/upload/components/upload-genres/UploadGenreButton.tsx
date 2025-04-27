import {StyleSheet, Text, TouchableOpacity} from 'react-native'
import {useCallback, useMemo} from "react";
import {SubgenreInterface} from "@/features/genre/types";
import {palette, spacing} from "@/theme";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";

interface UploadGenreButtonProps {
    subgenre: SubgenreInterface
}

const UploadGenreButton = ({subgenre}: UploadGenreButtonProps) => {

    const currentGenre = useUploadStoreSelectors.genre()
    const { setState: setUploadState } = useUploadStoreSelectors.actions()

    const selected = useMemo(() => {
        return currentGenre?.id === subgenre.id
    }, [currentGenre])

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
            item: {
                padding: spacing.m,
                color: palette.offwhite,
                backgroundColor: selected ? palette.olive : palette.grey
            }
        })
    }, [selected]);

    const handleSelectSubgenre = useCallback(() => {
        console.log(subgenre)
        setUploadState({ genre: subgenre })
    }, [subgenre])

    return(
        <TouchableOpacity onPress={handleSelectSubgenre}>
            <Text style={styles.item}>
                {subgenre.name}
            </Text>
        </TouchableOpacity>
    )
}

export default UploadGenreButton