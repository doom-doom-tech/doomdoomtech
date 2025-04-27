import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import TrackPlayButton from "@/features/track/components/TrackPlayButton";

interface FeedTrackActionProps {

}

const FeedTrackAction = ({}: FeedTrackActionProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'absolute',
                bottom: 16,
                right: 16
            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <TrackPlayButton />
        </View>
    )
}

export default FeedTrackAction