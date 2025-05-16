import {StyleSheet, View} from 'react-native'
import {useEffect, useMemo} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import FeedTrackMedia from "@/features/track/components/feed-track/FeedTrackMedia";
import FeedTrackHeader from "@/features/track/components/feed-track/FeedTrackHeader";
import {palette, spacing} from "@/theme";
import FeedTrackMetrics from "@/features/track/components/feed-track/FeedTrackMetrics";
import FeedTrackStatistics from "@/features/track/components/feed-track/FeedTrackStatistics";
import FeedTrackCaption from "@/features/track/components/feed-track/FeedTrackCaption";
import FeedTrackComments from "@/features/track/components/feed-track/FeedTrackComments";
import useTrackView from "@/features/track/hooks/useTrackView";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";

interface FeedTrackProps {

}

const FeedTrack = ({}: FeedTrackProps) => {

    const track = useTrackContext()

    const currentUser = useGlobalUserContext()

    const viewTrackMutation = useTrackView()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                position: 'relative',
                gap: spacing.s,
                paddingVertical: spacing.l,
                paddingBottom: spacing.m,
                borderBottomWidth: 2,
                borderColor: palette.granite
            },
        })
    }, []);

    useEffect(() => {
        currentUser && viewTrackMutation.mutate({ trackID: track.getID() })
    }, []);

    return(
        <View style={styles.wrapper}>
            <FeedTrackHeader />
            <FeedTrackMedia />
            <FeedTrackMetrics />
            <FeedTrackStatistics />
            <FeedTrackCaption />
            <FeedTrackComments />
        </View>
    )
}

export default FeedTrack