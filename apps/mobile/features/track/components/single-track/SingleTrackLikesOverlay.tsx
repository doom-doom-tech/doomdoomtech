import {StyleSheet} from 'react-native'
import {useMemo} from "react";
import TrackLikesOverlay from "@/features/track/components/TrackRate";

interface SingleTrackLikesOverlayProps {

}

const SingleTrackLikesOverlay = ({}: SingleTrackLikesOverlayProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    return(
        <TrackLikesOverlay />
    )
}

export default SingleTrackLikesOverlay