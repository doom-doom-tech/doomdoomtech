import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {Fragment, useMemo} from "react";
import {useMediaStoreSelectors} from "@/common/store/media";
import Title from "@/common/components/Title";
import Subtitle from "@/common/components/Subtitle";

interface BottomPlayerInformationProps {

}

const BottomPlayerInformation = ({}: BottomPlayerInformationProps) => {

    const { width } = useWindowDimensions()
    const current = useMediaStoreSelectors.current()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                maxWidth: width * 0.6
            },
        })
    }, []);

    const artists = useMemo(() => {
        return current && current.getArtists().map(artist => artist.getUsername()).join(', ')
    }, [current])

    if(!current) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <Title content={current.getTitle()} />
            <Subtitle content={artists} />
        </View>
    )
}

export default BottomPlayerInformation