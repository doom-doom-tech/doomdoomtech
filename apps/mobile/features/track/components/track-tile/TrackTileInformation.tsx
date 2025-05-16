import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import TrackInformation from "@/features/track/components/TrackInformation";

interface TrackTileInformationProps {
    center?: boolean
}

const TrackTileInformation = ({center}: TrackTileInformationProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <TrackInformation center={center} truncate />
        </View>
    )
}

export default TrackTileInformation