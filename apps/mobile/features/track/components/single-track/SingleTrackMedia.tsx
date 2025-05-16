import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import TrackCover from "@/features/track/components/TrackCover";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import {spacing} from "@/theme";
import SingleTrackRating from "@/features/track/components/single-track/SingleTrackRating";

interface SingleTrackMediaProps {

}

const SingleTrackMedia = ({}: SingleTrackMediaProps) => {

    const track = useTrackContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'relative',
                paddingTop: spacing.l,
                justifyContent: 'center',
                alignItems: 'center',
            },
        })
    }, []);

    return(
        <View style={styles.wrapper}>
            <TrackCover size={200} />
            <SingleTrackRating />
        </View>
    )
}

export default SingleTrackMedia