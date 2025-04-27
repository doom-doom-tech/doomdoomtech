import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {useTrackContext} from "@/features/track/context/TrackContextProvider";
import CommentRow from "@/features/comment/components/comment-row/CommentRow";
import {spacing} from "@/theme";
import {useQueryClient} from "@tanstack/react-query";

interface FeedTrackCommentsProps {

}

const FeedTrackComments = ({}: FeedTrackCommentsProps) => {

    const queryClient = useQueryClient();
    const track = useTrackContext()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
                paddingHorizontal: spacing.m,
            },
        })
    }, []);

    const handleDeleteComment = useCallback(async () => {
        queryClient.invalidateQueries({ queryKey: ['tracks', track.getID(), 'comments'] })
    }, [])

    return(
        <View style={styles.wrapper}>
            { track.getComments().map(comment => (
                <CommentRow
                    hideActions
                    hideReplies
                    comment={comment}
                    onDelete={handleDeleteComment}
                    key={comment.getID()} />
            ))}
        </View>
    )
}

export default FeedTrackComments