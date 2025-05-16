import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {Fragment, useMemo} from "react";
import Title from "@/common/components/Title";
import Subtitle from "@/common/components/Subtitle";
import useCurrentTrack from "@/features/track/hooks/useCurrentTrack";

interface BottomPlayerInformationProps {

}

const BottomPlayerInformation = ({}: BottomPlayerInformationProps) => {

    const { width } = useWindowDimensions()
    const current = useCurrentTrack()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                maxWidth: width * 0.5
            },
        })
    }, []);

    const artists = useMemo(() => {
        return current ? current.getArtists().map(artist => artist.getUsername()).join(', ') : ''
    }, [current])

    if(!current) return <Fragment />

    return(
        <View style={styles.wrapper}>
            <Title content={current.getTitle()} truncate />
            <Subtitle content={artists} />
        </View>
    )
}

export default BottomPlayerInformation